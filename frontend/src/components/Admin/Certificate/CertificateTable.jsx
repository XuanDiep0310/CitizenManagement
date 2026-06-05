import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Popconfirm,
  Space,
  notification,
  Tabs,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  callListBirthCertificatesAPI,
  deleteBirthCertificateAPI,
  updateBirthCertificateAPI,
  callListDeathCertificatesAPI,
  deleteDeathCertificateAPI,
} from "../../../services/api.service";
import "../../../assets/styles/certificateTable.scss";
import BirthCertCreateModal from "./BirthCertCreateModal";
import DeathCertCreateModal from "./DeathCertCreateModal";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const CertificateTable = () => {
  const [activeTab, setActiveTab] = useState("birth"); // "birth" | "death"
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingTable, setLoadingTable] = useState(false);

  // Modals visibility
  const [isBirthOpen, setIsBirthOpen] = useState(false);
  const [isDeathOpen, setIsDeathOpen] = useState(false);

  // Data states
  const [birthData, setBirthData] = useState([]);
  const [deathData, setDeathData] = useState([]);

  // Inline edit state for Birth Certificate
  const [editingBirthKey, setEditingBirthKey] = useState(null);
  const [birthDraft, setBirthDraft] = useState({});

  const fmt = (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "—");

  // Fetch birth certificates
  const fetchBirthCertificates = async () => {
    setLoadingTable(true);
    let query = `page=${current}&pageSize=${pageSize}`;
    if (searchTerm) query += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    try {
      const res = await callListBirthCertificatesAPI(query);
      if (res && res.data) {
        setBirthData(res.data);
        setTotal(res.pagination?.totalCount || res.totalCount || 0);
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi tải dữ liệu",
        description: "Không thể lấy danh sách giấy khai sinh",
      });
    } finally {
      setLoadingTable(false);
    }
  };

  // Fetch death certificates
  const fetchDeathCertificates = async () => {
    setLoadingTable(true);
    let query = `page=${current}&pageSize=${pageSize}`;
    if (searchTerm) query += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    try {
      const res = await callListDeathCertificatesAPI(query);
      if (res && res.data) {
        setDeathData(res.data);
        setTotal(res.pagination?.totalCount || res.totalCount || 0);
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi tải dữ liệu",
        description: "Không thể lấy danh sách giấy khai tử",
      });
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchCurrentTab = () => {
    if (activeTab === "birth") {
      fetchBirthCertificates();
    } else {
      fetchDeathCertificates();
    }
  };

  useEffect(() => {
    fetchCurrentTab();
  }, [current, pageSize, searchTerm, activeTab]);

  const handleOnChangePagi = (pagination) => {
    if (pagination?.pageSize && +pagination.pageSize !== +pageSize) {
      setPageSize(+pagination.pageSize);
      setCurrent(1);
    }
    if (pagination?.current && +pagination.current !== +current) {
      setCurrent(+pagination.current);
    }
  };

  // Inline edit handlers for Birth Certificates
  const startEditBirth = (record) => {
    setEditingBirthKey(record.birth_cert_id);
    setBirthDraft({
      birth_place: record.birth_place || "",
      registrar_name: record.registrar_name || "",
      notes: record.notes || "",
    });
  };

  const cancelEditBirth = () => {
    setEditingBirthKey(null);
    setBirthDraft({});
  };

  const saveEditBirth = async (record) => {
    const id = record.birth_cert_id;
    try {
      const res = await updateBirthCertificateAPI(id, {
        birth_place: birthDraft.birth_place?.trim(),
        registrar_name: birthDraft.registrar_name?.trim(),
        notes: birthDraft.notes?.trim() || null,
      });

      if (res && res.success === true) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Giấy khai sinh đã được cập nhật thành công!",
        });
        setEditingBirthKey(null);
        setBirthDraft({});
        fetchBirthCertificates();
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res?.message || "Cập nhật giấy khai sinh thất bại.",
        });
      }
    } catch (err) {
      notification.error({
        message: "Cập nhật thất bại",
        description: err?.response?.data?.message || err?.message || "Lỗi không xác định.",
      });
    }
  };

  // Delete handlers
  const handleDeleteBirth = async (id) => {
    try {
      const res = await deleteBirthCertificateAPI(id);
      if (res && (res.success === true || res.status === 200)) {
        notification.success({
          message: "Xóa giấy khai sinh",
          description: "Giấy khai sinh đã được xóa khỏi hệ thống.",
        });
        fetchBirthCertificates();
      }
    } catch (err) {
      notification.error({
        message: "Xóa thất bại",
        description: err?.response?.data?.message || err?.message || "Chỉ Admin mới có quyền xóa.",
      });
    }
  };

  const handleDeleteDeath = async (id) => {
    try {
      const res = await deleteDeathCertificateAPI(id);
      if (res && (res.success === true || res.status === 200)) {
        notification.success({
          message: "Xóa giấy khai tử",
          description: "Giấy khai tử đã được xóa khỏi hệ thống.",
        });
        fetchDeathCertificates();
      }
    } catch (err) {
      notification.error({
        message: "Xóa thất bại",
        description: err?.response?.data?.message || err?.message || "Chỉ Admin mới có quyền xóa.",
      });
    }
  };

  // Columns for Birth certificates
  const birthCols = useMemo(
    () => [
      {
        title: "Số khai sinh",
        dataIndex: "certificate_number",
        key: "certificate_number",
        width: 140,
        render: (t) => <span style={{ fontWeight: 600, color: "#1a4d8f" }}>{t}</span>,
      },
      {
        title: "Họ tên trẻ",
        dataIndex: "child_name",
        key: "child_name",
        width: 180,
      },
      {
        title: "Mã công dân",
        dataIndex: "child_citizen_code",
        key: "child_citizen_code",
        width: 140,
      },
      {
        title: "Giới tính",
        dataIndex: "child_gender",
        key: "child_gender",
        width: 100,
        render: (g) => (
          <Tag color={g === "Male" ? "blue" : "magenta"}>
            {g === "Male" ? "Nam" : "Nữ"}
          </Tag>
        ),
      },
      {
        title: "Ngày sinh",
        dataIndex: "child_dob",
        key: "child_dob",
        width: 120,
        render: fmt,
      },
      {
        title: "Họ tên cha",
        dataIndex: "father_name",
        key: "father_name",
        width: 160,
        render: (t) => t || "—",
      },
      {
        title: "Họ tên mẹ",
        dataIndex: "mother_name",
        key: "mother_name",
        width: 160,
        render: (t) => t || "—",
      },
      {
        title: "Nơi sinh",
        dataIndex: "birth_place",
        key: "birth_place",
        width: 250,
        render: (val, r) =>
          editingBirthKey === r.birth_cert_id ? (
            <Input
              value={birthDraft.birth_place}
              onChange={(e) =>
                setBirthDraft((d) => ({ ...d, birth_place: e.target.value }))
              }
            />
          ) : (
            val
          ),
      },
      {
        title: "Cán bộ đăng ký",
        dataIndex: "registrar_name",
        key: "registrar_name",
        width: 160,
        render: (val, r) =>
          editingBirthKey === r.birth_cert_id ? (
            <Input
              value={birthDraft.registrar_name}
              onChange={(e) =>
                setBirthDraft((d) => ({ ...d, registrar_name: e.target.value }))
              }
            />
          ) : (
            val || "—"
          ),
      },
      {
        title: "Ghi chú",
        dataIndex: "notes",
        key: "notes",
        width: 200,
        render: (val, r) =>
          editingBirthKey === r.birth_cert_id ? (
            <Input
              value={birthDraft.notes}
              onChange={(e) =>
                setBirthDraft((d) => ({ ...d, notes: e.target.value }))
              }
            />
          ) : (
            val || "—"
          ),
      },
      {
        title: "Ngày ĐK",
        dataIndex: "registration_date",
        key: "registration_date",
        width: 120,
        render: fmt,
      },
      {
        title: "Thao tác",
        key: "actions",
        fixed: "right",
        width: 160,
        render: (_, r) => {
          const isEditing = editingBirthKey === r.birth_cert_id;
          return isEditing ? (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                onClick={() => saveEditBirth(r)}
              >
                Lưu
              </Button>
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={cancelEditBirth}
              >
                Hủy
              </Button>
            </Space>
          ) : (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => startEditBirth(r)}
              />
              <Popconfirm
                title="Xóa giấy khai sinh"
                description="Bạn có chắc chắn muốn xóa giấy khai sinh này? Hành động này không thể hoàn tác."
                okType="danger"
                onConfirm={() => handleDeleteBirth(r.birth_cert_id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [editingBirthKey, birthDraft]
  );

  // Columns for Death certificates
  const deathCols = useMemo(
    () => [
      {
        title: "Số khai tử",
        dataIndex: "certificate_number",
        key: "certificate_number",
        width: 140,
        render: (t) => <span style={{ fontWeight: 600, color: "#c0392b" }}>{t}</span>,
      },
      {
        title: "Người qua đời",
        dataIndex: "full_name",
        key: "full_name",
        width: 180,
      },
      {
        title: "Mã công dân",
        dataIndex: "citizen_code",
        key: "citizen_code",
        width: 140,
      },
      {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
        width: 100,
        render: (g) => (
          <Tag color={g === "Male" ? "blue" : "magenta"}>
            {g === "Male" ? "Nam" : "Nữ"}
          </Tag>
        ),
      },
      {
        title: "Ngày sinh",
        dataIndex: "date_of_birth",
        key: "date_of_birth",
        width: 120,
        render: fmt,
      },
      {
        title: "Ngày mất",
        dataIndex: "date_of_death",
        key: "date_of_death",
        width: 120,
        render: fmt,
      },
      {
        title: "Tuổi khi mất",
        dataIndex: "age_at_death",
        key: "age_at_death",
        width: 110,
        align: "center",
        render: (a) => <Tag color="orange">{a} tuổi</Tag>,
      },
      {
        title: "Nguyên nhân",
        dataIndex: "cause_of_death",
        key: "cause_of_death",
        width: 200,
        render: (t) => t || "—",
      },
      {
        title: "Nơi mất",
        dataIndex: "place_of_death",
        key: "place_of_death",
        width: 250,
        render: (t) => t || "—",
      },
      {
        title: "Ngày ĐK",
        dataIndex: "registration_date",
        key: "registration_date",
        width: 120,
        render: fmt,
      },
      {
        title: "Thao tác",
        key: "actions",
        fixed: "right",
        width: 100,
        render: (_, r) => (
          <Popconfirm
            title="Xóa giấy khai tử"
            description="Bạn có chắc chắn muốn xóa giấy khai tử này? Trạng thái công dân sẽ được khôi phục."
            okType="danger"
            onConfirm={() => handleDeleteDeath(r.death_cert_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="certificate-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Quản Lý Giấy Tờ Hộ Tịch</h1>
            <p className="page-subtitle">
              Quản lý và đăng ký giấy khai sinh, khai tử cho công dân
            </p>
          </div>
        </div>

        <div className="content-card">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setCurrent(1);
              setSearchTerm("");
            }}
            destroyInactiveTabPane
            items={[
              {
                key: "birth",
                label: "Giấy Khai Sinh",
                children: (
                  <>
                    <div className="tab-actions" style={{ marginBottom: 16, display: "flex", gap: 12, justifyContent: "space-between" }}>
                      <Input
                        allowClear
                        placeholder="Tìm theo số khai sinh, tên trẻ hoặc mã công dân..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        prefix={<SearchOutlined />}
                        style={{ maxWidth: 400 }}
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsBirthOpen(true)}
                      >
                        Đăng ký khai sinh
                      </Button>
                    </div>

                    <Table
                      rowKey="birth_cert_id"
                      loading={loadingTable}
                      onChange={handleOnChangePagi}
                      columns={birthCols}
                      dataSource={birthData}
                      pagination={{
                        current,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50],
                        showTotal: (t, range) => `${range[0]}-${range[1]} trên ${t} dòng`,
                      }}
                      scroll={{ x: 1600 }}
                      size="middle"
                      sticky
                    />
                  </>
                ),
              },
              {
                key: "death",
                label: "Giấy Khai Tử",
                children: (
                  <>
                    <div className="tab-actions" style={{ marginBottom: 16, display: "flex", gap: 12, justifyContent: "space-between" }}>
                      <Input
                        allowClear
                        placeholder="Tìm theo số khai tử, tên người mất hoặc mã công dân..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        prefix={<SearchOutlined />}
                        style={{ maxWidth: 400 }}
                      />
                      <Button
                        type="primary"
                        danger
                        icon={<PlusOutlined />}
                        onClick={() => setIsDeathOpen(true)}
                      >
                        Đăng ký khai tử
                      </Button>
                    </div>

                    <Table
                      rowKey="death_cert_id"
                      loading={loadingTable}
                      onChange={handleOnChangePagi}
                      columns={deathCols}
                      dataSource={deathData}
                      pagination={{
                        current,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50],
                        showTotal: (t, range) => `${range[0]}-${range[1]} trên ${t} dòng`,
                      }}
                      scroll={{ x: 1600 }}
                      size="middle"
                      sticky
                    />
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      <BirthCertCreateModal
        open={isBirthOpen}
        onClose={() => setIsBirthOpen(false)}
        onCreated={fetchBirthCertificates}
      />

      <DeathCertCreateModal
        open={isDeathOpen}
        onClose={() => setIsDeathOpen(false)}
        onCreated={fetchDeathCertificates}
      />
    </>
  );
};

export default CertificateTable;
