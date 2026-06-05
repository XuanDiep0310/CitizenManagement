import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Spin,
  notification,
} from "antd";
import dayjs from "dayjs";
import {
  createDeathCertificateAPI,
  callListCitizensAPI,
} from "../../../services/api.service";

// Debounce helper
function useDebounce(v, ms = 400) {
  const [d, setD] = useState(v);
  useEffect(() => {
    const t = setTimeout(() => setD(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return d;
}

const DeathCertCreateModal = ({ open, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // States for citizen searches
  const [citizens, setCitizens] = useState([]);
  const [citizenSearch, setCitizenSearch] = useState("");
  const debCitizen = useDebounce(citizenSearch);
  const [loadingCitizens, setLoadingCitizens] = useState(false);

  // Fetch citizens
  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingCitizens(true);
      try {
        const res = await callListCitizensAPI({
          page: 1,
          size: 50,
          search: debCitizen || undefined,
        });
        setCitizens(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCitizens(false);
      }
    })();
  }, [debCitizen, open]);

  const citizenOptions = useMemo(
    () =>
      citizens.map((c) => ({
        value: Number(c.citizen_id),
        label: `${c.citizen_code} — ${c.full_name} (${c.dob ? dayjs(c.dob).format("DD/MM/YYYY") : ""})`,
      })),
    [citizens]
  );

  const handleCancel = () => {
    form.resetFields();
    onClose && onClose();
  };

  const onSubmit = async () => {
    try {
      const v = await form.validateFields();
      const payload = {
        citizen_id: Number(v.citizen_id),
        date_of_death: v.date_of_death,
        place_of_death: v.place_of_death || null,
        cause_of_death: v.cause_of_death || null,
        burial_place: v.burial_place || null,
        registrar_name: v.registrar_name || null,
        notes: v.notes || null,
      };

      setSubmitting(true);
      const res = await createDeathCertificateAPI(payload);

      if (res && (res.success === true || res.status === 200 || res.status === 201)) {
        message.success("Khai tử công dân thành công");
        form.resetFields();
        onClose && onClose();
        onCreated && onCreated();
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res?.error?.message || res?.message || "Không thể cấp giấy khai tử.",
        });
      }
    } catch (e) {
      if (!e?.errorFields) {
        message.error(e?.response?.data?.message || "Cấp giấy khai tử thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Cấp Giấy Khai Tử"
      open={open}
      onCancel={handleCancel}
      onOk={onSubmit}
      okText="Khai tử"
      cancelText="Hủy"
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ date_of_death: dayjs().format("YYYY-MM-DD") }}
      >
        <Form.Item
          label="Công dân qua đời"
          name="citizen_id"
          rules={[{ required: true, message: "Vui lòng chọn công dân cần khai tử" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Tìm theo mã công dân hoặc họ tên..."
            filterOption={false}
            onSearch={setCitizenSearch}
            notFoundContent={loadingCitizens ? <Spin size="small" /> : "Không tìm thấy công dân"}
            options={citizenOptions}
          />
        </Form.Item>

        <Form.Item
          label="Ngày qua đời"
          name="date_of_death"
          rules={[{ required: true, message: "Chọn ngày qua đời" }]}
          getValueFromEvent={(_, dateString) => dateString || undefined}
          getValueProps={(v) => ({
            value: v ? dayjs(v, "YYYY-MM-DD") : null,
          })}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Nơi qua đời"
          name="place_of_death"
          rules={[{ required: true, message: "Vui lòng nhập nơi qua đời" }]}
        >
          <Input placeholder="Nhập địa chỉ nơi mất (ví dụ: Bệnh viện Bạch Mai, nhà riêng...)" />
        </Form.Item>

        <Form.Item
          label="Nguyên nhân"
          name="cause_of_death"
          rules={[{ required: true, message: "Vui lòng nhập nguyên nhân tử vong" }]}
        >
          <Input placeholder="Ví dụ: Bệnh tuổi già, tai nạn giao thông..." />
        </Form.Item>

        <Form.Item
          label="Nơi an táng/hỏa táng"
          name="burial_place"
        >
          <Input placeholder="Ví dụ: Nghĩa trang Thiên Đức, Đài hóa thân Hoàn Vũ..." />
        </Form.Item>

        <Form.Item
          label="Cán bộ thực hiện đăng ký"
          name="registrar_name"
          rules={[{ required: true, message: "Nhập tên cán bộ thực hiện" }]}
        >
          <Input placeholder="Nhập tên cán bộ" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={3} placeholder="Ghi chú thêm thông tin (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeathCertCreateModal;
