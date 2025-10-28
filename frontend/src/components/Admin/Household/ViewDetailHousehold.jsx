import dayjs from "dayjs";
import {
  Button,
  Card,
  Descriptions,
  List,
  Modal,
  Space,
  Tag,
  Typography,
  message,
  notification,
} from "antd";
import {
  LeftOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../../../assets/styles/viewDetailHousehold.scss";
import { useNavigate } from "react-router";
import { useState } from "react";
import HouseholdMemberAddModal from "./HouseholdMemberAddModal";
import { deleteHouseholdMemberAPI } from "../../../services/api.service";

const { Title, Text } = Typography;

const ViewDetailHousehold = (props) => {
  const { dataHousehold, dataHouseholdMembers, handleDelete } = props;
  // ===== Map chính xác theo payload bạn gửi =====
  const household = {
    number: dataHousehold?.household_code ?? "—",
    address: dataHousehold?.address ?? "—",
    headOfHousehold: dataHousehold?.head_full_name ?? "—",
    // ghép vị trí: Phường - Quận/Huyện - Tỉnh/TP
    locationName:
      [
        dataHousehold?.ward_name,
        dataHousehold?.district_name,
        dataHousehold?.province_name,
      ]
        .filter(Boolean)
        .join(" · ") || "—",
    totalMembers:
      dataHousehold?.member_count ?? dataHouseholdMembers?.length ?? 0,
    registrationDate: dataHousehold?.registration_date || null,
    createdAt: dataHousehold?.created_at || null,
  };

  const createdStr = household.createdAt
    ? dayjs(household.createdAt).format("DD/MM/YYYY HH:mm")
    : "—";
  const registrationStr = household.registrationDate
    ? dayjs(household.registrationDate).format("DD/MM/YYYY")
    : "—";

  const roleTagColor = (role) => {
    const r = (role || "").toLowerCase();
    if (r.includes("chủ") || r.includes("head")) return "geekblue";
    if (r.includes("vợ") || r.includes("chồng") || r.includes("spouse"))
      return "purple";
    if (r.includes("con") || r.includes("child")) return "green";
    return "default";
  };

  // Các action chỉ báo message để bạn tự gắn logic sau
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };
  const onEdit = () => message.info("Edit household");
  const onDelete = () => {
    handleDelete();
  };

  const [isAddOpen, setIsAddOpen] = useState(false);

  const onAddMember = () => setIsAddOpen(true);

  // Optional: after adding, you might want to refresh the detail/members list
  const handleMemberAdded = () => {
    // e.g., call a parent-provided fetch function if available
    // fetchHousehold?.();
    // or fetchMembers?.();
    message.success("Household members refreshed");
  };
  const onDeleteMember = (memberId) => {
    Modal.confirm({
      title: "Remove this member?",
      content: "This action cannot be undone.",
      okText: "Remove",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          const res = await deleteHouseholdMemberAPI(
            dataHousehold?.household_id,
            memberId
          );
          console.log(dataHousehold?.household_id, memberId);
          if (res && (res.success === true || res.status === 200)) {
            notification.success({
              message: "Member removed",
              description: "The member was removed successfully.",
            });
            // refresh list if provided            handleMemberAdded?.();
          } else {
            const errMsg =
              res?.error?.message || res?.message || "Failed to remove member.";
            notification.error({
              message: "Remove failed",
              description: String(errMsg),
            });
          }
        } catch (error) {
          notification.error({
            message: "Remove error",
            description:
              error?.response?.data?.message ||
              +error?.message ||
              "An unexpected error occurred.",
          });
        }
      },
    });
  };

  return (
    <>
      <div className="vd-container">
        {/* Header */}
        <Card bodyStyle={{ padding: 24 }} className="vd-header-card">
          <div className="vd-header">
            <div className="vd-header__left">
              <Button type="text" icon={<LeftOutlined />} onClick={onBack}>
                Back
              </Button>
              <div className="vd-header__title">
                <Title level={2} className="vd-h1">
                  Household Details
                </Title>
                <p className="vd-subtitle">
                  View and manage household information
                </p>
              </div>
            </div>

            <div className="vd-header__actions">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>

        <div className="vd-content">
          {/* Household Info */}
          <Card className="vd-card">
            <div className="vd-card__header">
              <div>
                <h2 className="vd-h2">Household Information</h2>
                <p className="vd-subtitle">
                  Basic details about this household
                </p>
              </div>
            </div>

            <Descriptions
              className="vd-info-grid"
              column={{ xs: 1, sm: 1, md: 2 }}
              labelStyle={{ color: "var(--ant-color-text-tertiary)" }}
              contentStyle={{ fontWeight: 600 }}
              items={[
                {
                  key: "number",
                  label: "Household Code",
                  children: household.number,
                },
                {
                  key: "address",
                  label: (
                    <Space size={6}>
                      <EnvironmentOutlined /> Address
                    </Space>
                  ),
                  children: household.address,
                },
                {
                  key: "head",
                  label: "Head of Household",
                  children: household.headOfHousehold,
                },
                {
                  key: "location",
                  label: "Location",
                  children: <Tag color="blue">{household.locationName}</Tag>,
                },
                {
                  key: "members",
                  label: (
                    <Space size={6}>
                      <TeamOutlined /> Total Members
                    </Space>
                  ),
                  children: household.totalMembers,
                },
                {
                  key: "regDate",
                  label: (
                    <Space size={6}>
                      <CalendarOutlined /> Registration Date
                    </Space>
                  ),
                  children: registrationStr,
                },
                {
                  key: "created",
                  label: (
                    <Space size={6}>
                      <CalendarOutlined /> Created At
                    </Space>
                  ),
                  children: createdStr,
                },
              ]}
            />
          </Card>

          {/* Members */}
          <Card className="vd-card">
            <div className="vd-card__header vd-card__header--with-btn">
              <div>
                <h2 className="vd-h2">Household Members</h2>
                <p className="vd-subtitle">Manage members of this household</p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddMember}
              >
                Add Member
              </Button>
            </div>

            <div className="vd-members">
              <List
                dataSource={dataHouseholdMembers}
                locale={{ emptyText: "No members" }}
                renderItem={(m) => {
                  const name = m.full_name ?? m.name ?? "—";
                  const role =
                    m.relationship ??
                    m.relationship_to_head ??
                    m.role ??
                    "Member";
                  const idNumber = m.citizen_code ?? m.idNumber ?? "—";
                  const dobRaw = m.date_of_birth ?? m.dateOfBirth ?? null;
                  const dob = dobRaw ? dayjs(dobRaw).format("DD/MM/YYYY") : "—";
                  const gender = m.gender ?? "—";

                  return (
                    <List.Item
                      className="vd-member"
                      actions={[
                        <Button
                          key="delete"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            onDeleteMember(
                              m.member_id ?? m.id ?? m.household_member_id
                            )
                          }
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space size={12} wrap>
                            <Text strong className="vd-h3">
                              {name}
                            </Text>
                            <Tag color={roleTagColor(role)} className="vd-role">
                              {role}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div className="vd-member__details">
                            <div className="vd-detail">
                              <Text
                                type="secondary"
                                className="vd-detail__label"
                              >
                                Citizen Code: <span> </span>
                              </Text>
                              <Text className="vd-detail__value">
                                {idNumber}
                              </Text>
                            </div>
                            <div className="vd-detail">
                              <Text
                                type="secondary"
                                className="vd-detail__label"
                              >
                                Date of Birth: <span> </span>
                              </Text>
                              <Text className="vd-detail__value">{dob}</Text>
                            </div>
                            <div className="vd-detail">
                              <Text
                                type="secondary"
                                className="vd-detail__label"
                              >
                                Gender: <span> </span>
                              </Text>
                              <Text className="vd-detail__value">{gender}</Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          </Card>
        </div>
      </div>
      <HouseholdMemberAddModal
        open={isAddOpen}
        setOpen={setIsAddOpen}
        householdId={dataHousehold?.household_id}
        handleMemberAdded={handleMemberAdded}
      />
    </>
  );
};

export default ViewDetailHousehold;
