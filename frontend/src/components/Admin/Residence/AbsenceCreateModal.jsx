import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { createTemporaryAbsencesAPI } from "../../../services/api.service";

dayjs.locale("vi");

const AbsenceCreateModal = (props) => {
  const { open, onClose, onCreated } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      await createTemporaryAbsencesAPI({
        citizen_id: Number(values.citizen_id),
        destination_address: values.destination_address,
        destination_ward_code: values.destination_ward_code, // string
        reason: values.reason || null,
        start_date: values.start_date?.toDate?.() ?? values.start_date,
        expected_return_date:
          (values.expected_return_date?.toDate?.() ??
            values.expected_return_date) ||
          null,
        notes: values.notes || null,
      });

      message.success("Tạo tạm vắng thành công");
      form.resetFields();
      onClose();
      onCreated?.();
    } catch (e) {
      if (!e?.errorFields) {
        message.error(e?.response?.data?.message || "Tạo tạm vắng thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm tạm vắng"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={onSubmit}
      okText="Tạo"
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          start_date: dayjs(),
        }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="ID công dân"
              name="citizen_id"
              rules={[{ required: true, message: "Nhập ID công dân" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="VD: 101"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mã phường đến (ward_code)"
              name="destination_ward_code"
              rules={[
                { required: true, message: "Nhập destination_ward_code" },
              ]}
              tooltip="Ward Code dạng chuỗi, ví dụ: 20209"
            >
              <Input placeholder="VD: 20209" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Địa chỉ đến"
          name="destination_address"
          rules={[{ required: true, message: "Nhập địa chỉ đến" }]}
        >
          <Input placeholder="Số nhà/đường, phường, quận, tỉnh..." />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="start_date"
              rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Dự kiến về" name="expected_return_date">
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Lý do" name="reason">
          <Input.TextArea rows={3} placeholder="Lý do tạm vắng..." />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AbsenceCreateModal;
