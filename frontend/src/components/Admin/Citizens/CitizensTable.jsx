import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Popconfirm,
  Space,
  message,
  notification,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  callListCitizensAPI,
  deleteCitizenAPI,
} from "../../../services/api.service";
import "../../../assets/styles/citizensTable.scss";
import CitizenModalDetail from "./CitizenModalDetail";
import CitizenModalCreate from "./CitizenModalCreate";

const DEBOUNCE_MS = 400;

const statusColor = (s) => {
  switch (s) {
    case "Active":
      return "green";
    case "Pending":
      return "gold";
    case "Inactive":
      return "red";
    default:
      return "blue";
  }
};

export default function CitizensTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(100);
  const [citizensData, setCitizensData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  // const [sortQuery, setSortQuery] = useState("");
  // const [filter, setFilter] = useState("");

  const [citizenDetail, setCitizenDetail] = useState();
  const [isDetailCitizenOpen, setIsDetailCitizenOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const fetchCitizen = async () => {
    setLoadingTable(true);
    let query = `page=${current}&pageSize=${pageSize}`;
    // if (filter) {
    //   query += `${filter}`;
    // }
    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }
    const res = await callListCitizensAPI(query);
    if (res && res.data) {
      setCurrent(+res.pagination.page);
      setPageSize(+res.pagination.pageSize);
      setTotal(res.pagination.totalCount);
      setCitizensData(res.data);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchCitizen();
  }, [current, pageSize]);
  // , sortQuery, filter

  const handleOnChangePagi = (pagination, filters, sorter) => {
    if (
      pagination &&
      pagination.pageSize &&
      +pagination.pageSize !== +pageSize
    ) {
      setPageSize(+pagination.pageSize);
      setCurrent(1);
    }

    if (pagination && pagination.current && +pagination.current !== +current) {
      setCurrent(+pagination.current);
      console.log(pagination.current);
    }
    // console.log(">>>", pagination, filters, sorter, extra);
    if (sorter && sorter.order) {
      // const q =
      //   sorter.order === "ascend"
      //     ? `sort=${sorter.field}`
      //     : `sort=-${sorter.field}`;
      // if (q) setSortQuery(q);
    }
  };
  // const handleExport = () => {
  //   if (userData.length > 0) {
  //     const worksheet = XLSX.utils.json_to_sheet(userData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //     XLSX.writeFile(workbook, "ExportUser.xlsx");
  //   }
  // };

  const handleView = (record) => {
    setCitizenDetail(record);
    setIsDetailCitizenOpen(true);
  };
  const handleEdit = (id) => {
    message.info(`Edit citizen: ${id}`);
  };
  const handleDelete = async (id) => {
    const res = await deleteCitizenAPI(id);
    console.log(res);
    if (res && res.success === true) {
      notification.success({
        message: "Delete Citizen",
        description: "success!",
      });
      await fetchCitizen();
    } else {
      notification.error({
        message: "error",
        description: JSON.stringify(res.error.message),
      });
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      // ellipsis: true,
      render: (t) => <span style={{ fontWeight: 500 }}>{t}</span>,
    },
    {
      title: "ID Citizen",
      dataIndex: "citizen_code",
      key: "citizen_code",
      render: (t) => <code style={{ color: "rgba(0,0,0,.65)" }}>{t}</code>,
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      sorter: false,
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Location",
      dataIndex: "permanent_address",
      key: "lpermanent_address",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={statusColor(s)} style={{ fontWeight: 600 }}>
          {s}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "Active" },
        { text: "Pending", value: "Pending" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 160,
      render: (_, r) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(r)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(r.id)}
          />
          <Popconfirm
            title="Delete citizen"
            description="Are you sure you want to delete this citizen?"
            okType="danger"
            onConfirm={() => handleDelete(r.citizen_id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="citizens-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Citizens</h1>
            <p className="page-subtitle">
              Manage citizen records and information
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateOpen(true)}
          >
            Add Citizen
          </Button>
        </div>

        <div className="content-card">
          <div className="card-header">
            <div className="card-header-text">
              <h2 className="card-title">Citizen Records</h2>
              <p className="card-subtitle">
                View and manage all citizen information
              </p>
            </div>
          </div>

          <div
            style={{
              marginBottom: 16,
              display: "flex",
              gap: 20,
              width: "100%",
            }}
          >
            <Input
              allowClear
              placeholder="Search by name or ID number..."
              value={searchTerm}
              // onChange={(e) => {
              //   setSearchTerm(e.target.value);
              //   setCurrent(1);
              // }}
              prefix={<SearchOutlined />}
              // style={{ flex: 1, minWidth: 0 }}
            />
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={citizensData}
            loading={loadingTable}
            onChange={handleOnChangePagi}
            pagination={{
              current,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50],

              showTotal: (total, range) =>
                `${range[0]}-${range[1]} trên ${total} rows`,
            }}
            scroll={{ x: 900 }}
            size="middle"
            sticky
          />
        </div>
      </div>
      <CitizenModalDetail
        citizenDetail={citizenDetail}
        setCitizenDetail={setCitizenDetail}
        isDetailCitizenOpen={isDetailCitizenOpen}
        setIsDetailCitizenOpen={setIsDetailCitizenOpen}
      />
      <CitizenModalCreate
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        fetchCitizen={fetchCitizen}
      />
      {/* <CitizenModalUpdate
              isModalOpenUpdate={isModalOpenUpdate}
              setIsModalOpenUpdate={setIsModalOpenUpdate}
              bookUpdate={bookUpdate}
              setBookUpdate={setBookUpdate}
              fetchBook={fetchBook}
            /> */}
    </>
  );
}
