import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Select,
  Spin,
  notification,
} from "antd";
import {
  createBirthCertificateAPI,
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

const BirthCertCreateModal = ({ open, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // States for citizen searches
  const [citizens, setCitizens] = useState([]);
  const [childSearch, setChildSearch] = useState("");
  const debChild = useDebounce(childSearch);

  const [fatherSearch, setFatherSearch] = useState("");
  const debFather = useDebounce(fatherSearch);

  const [motherSearch, setMotherSearch] = useState("");
  const debMother = useDebounce(motherSearch);

  const [loadingCitizens, setLoadingCitizens] = useState(false);

  // Single function to fetch citizens
  const fetchCitizens = async (searchVal) => {
    setLoadingCitizens(true);
    try {
      const res = await callListCitizensAPI({
        page: 1,
        size: 50,
        search: searchVal || undefined,
      });
      setCitizens(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCitizens(false);
    }
  };

  // Triggers citizen list refresh based on searches
  useEffect(() => {
    if (!open) return;
    fetchCitizens(debChild || debFather || debMother || "");
  }, [debChild, debFather, debMother, open]);

  const citizenOptions = useMemo(
    () =>
      citizens.map((c) => ({
        value: Number(c.citizen_id),
        label: `${c.citizen_code} — ${c.full_name} (${c.gender === "Male" ? "Nam" : "Nữ"})`,
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
        child_citizen_id: Number(v.child_citizen_id),
        father_citizen_id: v.father_citizen_id ? Number(v.father_citizen_id) : null,
        mother_citizen_id: v.mother_citizen_id ? Number(v.mother_citizen_id) : null,
        birth_place: v.birth_place || null,
        registrar_name: v.registrar_name || null,
        notes: v.notes || null,
      };

      setSubmitting(true);
      const res = await createBirthCertificateAPI(payload);

      if (res && (res.success === true || res.status === 200 || res.status === 201)) {
        message.success("Cấp giấy khai sinh thành công");
        form.resetFields();
        onClose && onClose();
        onCreated && onCreated();
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res?.error?.message || res?.message || "Không thể tạo giấy khai sinh.",
        });
      }
    } catch (e) {
      if (!e?.errorFields) {
        message.error(e?.response?.data?.message || "Tạo giấy khai sinh thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Cấp Giấy Khai Sinh"
      open={open}
      onCancel={handleCancel}
      onOk={onSubmit}
      okText="Cấp giấy"
      cancelText="Hủy"
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Trẻ em (Công dân)"
          name="child_citizen_id"
          rules={[{ required: true, message: "Chọn công dân là trẻ em cần cấp giấy" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Tìm theo mã công dân hoặc tên trẻ..."
            filterOption={false}
            onSearch={setChildSearch}
            notFoundContent={loadingCitizens ? <Spin size="small" /> : "Không tìm thấy công dân"}
            options={citizenOptions}
          />
        </Form.Item>

        <Form.Item
          label="Cha (nếu có)"
          name="father_citizen_id"
        >
          <Select
            showSearch
            allowClear
            placeholder="Tìm theo mã công dân hoặc tên cha..."
            filterOption={false}
            onSearch={setFatherSearch}
            notFoundContent={loadingCitizens ? <Spin size="small" /> : "Không tìm thấy công dân"}
            options={citizenOptions}
          />
        </Form.Item>

        <Form.Item
          label="Mẹ (nếu có)"
          name="mother_citizen_id"
        >
          <Select
            showSearch
            allowClear
            placeholder="Tìm theo mã công dân hoặc tên mẹ..."
            filterOption={false}
            onSearch={setMotherSearch}
            notFoundContent={loadingCitizens ? <Spin size="small" /> : "Không tìm thấy công dân"}
            options={citizenOptions}
          />
        </Form.Item>

        <Form.Item
          label="Nơi sinh"
          name="birth_place"
          rules={[{ required: true, message: "Vui lòng nhập nơi sinh" }]}
        >
          <Input placeholder="Nhập địa chỉ nơi sinh (ví dụ: Bệnh viện Phụ sản Hà Nội...)" />
        </Form.Item>

        <Form.Item
          label="Người ký/Người thực hiện"
          name="registrar_name"
          rules={[{ required: true, message: "Vui lòng nhập tên người thực hiện đăng ký" }]}
        >
          <Input placeholder="Nhập tên cán bộ thực hiện" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={3} placeholder="Ghi chú thêm thông tin (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BirthCertCreateModal;
