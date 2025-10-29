import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  message,
  Select,
  Spin,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  createTemporaryResidencesAPI,
  callListCitizensAPI,
  callListWardAPI,
} from "../../../services/api.service";

dayjs.locale("vi");

function useDebounce(v, ms = 500) {
  const [d, setD] = useState(v);
  useEffect(() => {
    const t = setTimeout(() => setD(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return d;
}

const ResidenceCreateModal = ({ open, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // citizens
  const [citizens, setCitizens] = useState([]);
  const [citizenSearch, setCitizenSearch] = useState("");
  const debCitizen = useDebounce(citizenSearch, 400);
  const [loadingCitizens, setLoadingCitizens] = useState(false);

  // wards (use ward_id)
  const [wards, setWards] = useState([]);
  const [wardSearch, setWardSearch] = useState("");
  const debWard = useDebounce(wardSearch, 400);
  const [loadingWards, setLoadingWards] = useState(false);

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
      } finally {
        setLoadingCitizens(false);
      }
    })();
  }, [debCitizen, open]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingWards(true);
      try {
        const res = await callListWardAPI({
          page: 1,
          size: 50,
          search: debWard || undefined,
        });
        setWards(Array.isArray(res?.data) ? res.data : []);
      } finally {
        setLoadingWards(false);
      }
    })();
  }, [debWard, open]);

  // citizen_id yêu cầu STRING
  const citizenOptions = useMemo(
    () =>
      citizens.map((c) => ({
        value: String(c.citizen_id), // <-- string
        label: `${c.citizen_code} — ${c.full_name}${
          c.phone ? " (" + c.phone + ")" : ""
        }`,
      })),
    [citizens]
  );

  // ward_id giữ NUMBER
  const wardOptions = useMemo(
    () =>
      wards.map((w) => ({
        value: w.ward_id, // number
        label: `${w.ward_name} — ${w.district_name || ""} — ${
          w.province_name || ""
        } [${w.ward_code}]`,
      })),
    [wards]
  );

  const onSubmit = async () => {
    try {
      const v = await form.validateFields();
      setSubmitting(true);

      const payload = {
        citizen_id: v.citizen_id, // string
        temporary_address: v.temporary_address,
        ward_id: Number(v.ward_id), // number
        reason: v.reason || null,
        start_date: v.start_date, // "YYYY-MM-DD"
        end_date: v.end_date || null, // "YYYY-MM-DD" | null
        notes: v.notes || null,
      };
      console.log(payload);
      // const res = await createTemporaryResidencesAPI(payload);
      // console.log("CreateResidence =>", res);
      // message.success("Tạo tạm trú thành công");
      form.resetFields();
      onClose();
      onCreated && onCreated();
    } catch (e) {
      if (!e?.errorFields) {
        message.error(e?.response?.data?.message || "Tạo tạm trú thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm tạm trú"
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
        initialValues={{ start_date: dayjs().format("YYYY-MM-DD") }} // <-- string
      >
        <Form.Item
          label="Công dân"
          name="citizen_id"
          rules={[{ required: true, message: "Chọn công dân" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Tìm mã, tên, SĐT…"
            filterOption={false}
            onSearch={setCitizenSearch}
            notFoundContent={
              loadingCitizens ? <Spin size="small" /> : "Không có dữ liệu"
            }
            options={citizenOptions}
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ tạm trú"
          name="temporary_address"
          rules={[{ required: true, message: "Nhập địa chỉ tạm trú" }]}
        >
          <Input placeholder="Số nhà/đường, phường, quận, tỉnh..." />
        </Form.Item>

        <Form.Item
          label="Phường/Xã (ward)"
          name="ward_id"
          rules={[{ required: true, message: "Chọn phường/xã" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Tìm theo tên/code…"
            filterOption={false}
            onSearch={setWardSearch}
            notFoundContent={
              loadingWards ? <Spin size="small" /> : "Không có dữ liệu"
            }
            options={wardOptions}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="start_date"
              rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
            >
              <DatePicker
                format="YYYY-MM-DD" // hiển thị
                valueFormat="YYYY-MM-DD" // trả về STRING "YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ngày kết thúc (nếu có)" name="end_date">
              <DatePicker
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD" // cũng trả về STRING
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Lý do" name="reason">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResidenceCreateModal;
