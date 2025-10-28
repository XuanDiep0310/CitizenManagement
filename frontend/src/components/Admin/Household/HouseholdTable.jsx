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
import {
  callListHouseholdAPI,
  deleteHouseholdAPI,
} from "../../../services/api.service";
import "../../../assets/styles/householdTable.scss";
import { useNavigate } from "react-router";

const HouseholdTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(100);
  const [householdData, setHouseholdData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  // const [sortQuery, setSortQuery] = useState("");
  // const [filter, setFilter] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const fetchHousehold = async () => {
    setLoadingTable(true);
    let query = `page=${current}&pageSize=${pageSize}`;
    // if (filter) {
    //   query += `${filter}`;
    // }
    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }
    if (searchTerm) {
      query += `&searchTerm=${searchTerm}`;
    }
    const res = await callListHouseholdAPI(query);
    if (res && res.data) {
      setCurrent(+res.pagination.page);
      setPageSize(+res.pagination.pageSize);
      setTotal(res.pagination.totalCount);
      setHouseholdData(res.data);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchHousehold();
  }, [current, pageSize, searchTerm]);
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
  const handleEdit = (id) => {
    message.info(`Edit household: ${id}`);
  };
  const handleDelete = async (id) => {
    const res = await deleteHouseholdAPI(id);
    console.log(res);
    if (res && res.success === true) {
      notification.success({
        message: "Delete Household",
        description: "success!",
      });
      await fetchHousehold();
    } else {
      notification.error({
        message: "error",
        description: JSON.stringify(res.error.message),
      });
    }
  };

  const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );

    return str;
  };
  const convertSlug = (str) => {
    str = removeVietnameseTones(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };
  const navigate = useNavigate();
  const handleRedirectHousehold = (householdDetail) => {
    var str =
      householdDetail.head_full_name +
      householdDetail.household_id +
      householdDetail.household_code;
    const slug = convertSlug(str);
    navigate(`/admin/household/${slug}?id=${householdDetail.household_id}`);
  };
  const columns = [
    {
      title: "Household Number",
      dataIndex: "household_code",
      key: "household_code",
      // ellipsis: true,
      render: (t) => <span style={{ fontWeight: 500 }}>{t}</span>,
    },
    {
      title: "Household Head",
      dataIndex: "head_full_name",
      key: "head_full_name",
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 500,
      ellipsis: true,
    },
    {
      title: "Members",
      dataIndex: "member_count",
      key: "member_count",
      render: (s) => (
        <Tag color="blue" style={{ fontWeight: 600 }}>
          {s} Members
        </Tag>
      ),
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
            onClick={() => handleRedirectHousehold(r)}
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
            onConfirm={() => handleDelete(r.household_id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="household-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Households</h1>
            <p className="page-subtitle">
              Manage household records and members
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateOpen(true)}
          >
            New Household
          </Button>
        </div>

        <div className="content-card">
          <div className="card-header">
            <div className="card-header-text">
              <h2 className="card-title">Household Records</h2>
              <p className="card-subtitle">
                View and manage all household information
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
              placeholder="Search by household or ID number or Address"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              prefix={<SearchOutlined />}
              // style={{ flex: 1, minWidth: 0 }}
            />
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={householdData}
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

      {/* <HouseholdModalCreate
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        fetchHousehold={fetchHousehold}
      /> */}
    </>
  );
};
export default HouseholdTable;
