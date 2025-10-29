import { useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tabs,
  Tag,
  message,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import "../../../assets/styles/residenceTable.scss";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const STATUS_COLORS = {
  active: "green",
  pending: "gold",
  completed: "default",
};

const ResidenceTable = () => {
  const [activeTab, setActiveTab] = useState("residence"); // residence | absence
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = useMemo(
    () => records.filter((r) => r.type === activeTab),
    [records, activeTab]
  );

  const columns = [
    { title: "Citizen", dataIndex: "citizen", key: "citizen" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
      width: 130,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
      width: 130,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (s) => <Tag color={STATUS_COLORS[s] || "default"}>{s}</Tag>,
      filters: [
        { text: "Active", value: "active" },
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
      ],
      onFilter: (val, record) => record.status === val,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Delete this record?"
          okText="Delete"
          cancelText="Cancel"
          placement="left"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    message.success("Deleted.");
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.dateRange || [];
      const newRecord = {
        id: Date.now(),
        type: activeTab,
        citizen: values.citizen.trim(),
        location: values.location.trim(),
        reason: values.reason.trim(),
        startDate: start?.toISOString() ?? null,
        endDate: end?.toISOString() ?? null,
        status: values.status,
      };
      setRecords((prev) => [newRecord, ...prev]);
      setOpen(false);
      form.resetFields();
      message.success("Record created.");
    } catch {
      // validation errors are shown by Form
    }
  };

  return (
    <div className="residence-tracker" locale={viVN}>
      <div className="residence-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Temporary Residence & Absence
          </Title>
          <Text className="residence-subtitle">
            Manage temporary residence and absence records
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="residence-btn-new"
          onClick={() => setOpen(true)}
        >
          New Record
        </Button>
      </div>

      <Card className="residence-records">
        <div className="residence-section-header">
          <div className="residence-section-title">Records</div>
          <div className="residence-section-subtitle">
            Temporary residence and absence records
          </div>
        </div>

        <Tabs
          className="residence-tabs"
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "residence", label: "Temporary Residence" },
            { key: "absence", label: "Temporary Absence" },
          ]}
        />

        <div className="residence-table-container">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 8, showSizeChanger: true }}
            locale={{
              emptyText: (
                <span className="residence-no-records">No records found</span>
              ),
            }}
          />
        </div>
      </Card>

      <Modal
        title={
          <span className="residence-modal-title">
            New {activeTab === "residence" ? "Residence" : "Absence"} Record
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        okText="Create"
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Citizen Name"
            name="citizen"
            rules={[{ required: true, message: "Please enter citizen name" }]}
          >
            <Input placeholder="Enter citizen name" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please enter reason" }]}
          >
            <Input placeholder="Enter reason" />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="dateRange"
            rules={[
              { required: true, message: "Please pick start & end date" },
            ]}
          >
            <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue="active"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResidenceTable;
