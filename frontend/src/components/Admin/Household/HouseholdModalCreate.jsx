import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message, Spin, notification } from "antd";
import {
  callListCitizensAPI,
  callListWardAPI,
  createHouseholdAPI,
} from "../../../services/api.service";

const HouseholdModalCreate = ({
  isCreateOpen,
  setIsCreateOpen,
  fetchHousehold,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [citizens, setCitizens] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingCitizens, setLoadingCitizens] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // === Fetch Citizens (Head of Household) ===
  const fetchCitizens = async () => {
    setLoadingCitizens(true);
    try {
      const res = await callListCitizensAPI();
      if (res && res.data) {
        const data = res.data.map((c) => ({
          label: `${c.full_name} (${c.citizen_code})`,
          value: c.citizen_id,
        }));
        setCitizens(data);
      }
    } catch (err) {
      message.error("Không thể tải danh sách công dân");
      console.log(err);
    } finally {
      setLoadingCitizens(false);
    }
  };

  // === Fetch Wards ===
  const fetchWards = async () => {
    setLoadingWards(true);
    try {
      const res = await callListWardAPI();
      if (res && res.data) {
        const data = res.data.map((w) => ({
          label: w.ward_name, // tiếng Việt từ DB
          value: w.ward_id,
        }));
        setWards(data);
      }
    } catch (err) {
      message.error("Không thể tải danh sách phường");
      console.log(err);
    } finally {
      setLoadingWards(false);
    }
  };

  useEffect(() => {
    if (isCreateOpen) {
      fetchCitizens();
      fetchWards();
      form.setFieldsValue({
        household_type: "Thường trú", // tiếng Việt cho dữ liệu
      });
    } else {
      form.resetFields();
    }
  }, [isCreateOpen]);

  const handleCancel = () => {
    setIsCreateOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    const payload = {
      head_of_household_id: values.head_of_household_id,
      address: values.address?.trim(),
      ward_id: values.ward_id,
      household_type: values.household_type, // giữ tiếng Việt
      notes: values.notes?.trim() || null,
    };

    setSubmitting(true);
    try {
      const res = await createHouseholdAPI(payload);
      console.log(res);
      if (res && res.data) {
        message.success("Household created successfully!");
        setIsCreateOpen(false);
        form.resetFields();
        await fetchHousehold?.();
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: JSON.stringify(res?.error.message),
        });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create household";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create New Household"
      open={isCreateOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Create"
      cancelText="Cancel"
      confirmLoading={submitting}
      maskClosable={!submitting}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        {/* Head of Household */}
        <Form.Item
          label="Head of Household"
          name="head_of_household_id"
          rules={[
            { required: true, message: "Please select the head of household" },
          ]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Select or type a citizen"
            notFoundContent={loadingCitizens ? <Spin size="small" /> : null}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={citizens}
          />
        </Form.Item>

        {/* Address */}
        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: "Please enter the address" },
            { max: 255, message: "Maximum 255 characters" },
          ]}
        >
          <Input placeholder="e.g., Số 3 Đường HK Seed" />
        </Form.Item>

        {/* Ward */}
        <Form.Item
          label="Ward"
          name="ward_id"
          rules={[{ required: true, message: "Please select a ward" }]}
        >
          <Select
            showSearch
            placeholder="Select a ward"
            loading={loadingWards}
            options={wards}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {/* Household Type */}
        <Form.Item
          label="Household Type"
          name="household_type"
          rules={[{ required: true, message: "Please select household type" }]}
        >
          <Select
            options={[{ label: "Thường trú", value: "Thuong tru" }]}
            placeholder="Select household type"
          />
        </Form.Item>

        {/* Notes */}
        <Form.Item
          label="Notes"
          name="notes"
          rules={[{ max: 500, message: "Maximum 500 characters" }]}
        >
          <Input.TextArea
            placeholder="Additional notes (optional)"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HouseholdModalCreate;
