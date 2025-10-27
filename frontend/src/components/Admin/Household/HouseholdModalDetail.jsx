import { Descriptions, Drawer } from "antd";
import moment from "moment";
const HouseholdModalDetail = (props) => {
  const {
    householdDetail,
    setHouseholdDetail,
    isDetailHouseholdOpen,
    setIsDetailHouseholdOpen,
  } = props;

  return (
    <>
      <Drawer
        title="Detail view function"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => {
          setHouseholdDetail(null);
          setIsDetailHouseholdOpen(false);
        }}
        open={isDetailHouseholdOpen}
        width="50vw"
      >
        <Descriptions title="Household information" column={2} bordered>
          <Descriptions.Item label="Household Number">
            {householdDetail?.household_code}
          </Descriptions.Item>
          <Descriptions.Item label="Members">
            {householdDetail?.member_count}
          </Descriptions.Item>
          <Descriptions.Item label="Citizen Code">
            {householdDetail?.head_citizen_code}
          </Descriptions.Item>
          <Descriptions.Item label="Household Head">
            {householdDetail?.head_full_name}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {householdDetail?.address}
          </Descriptions.Item>

          <Descriptions.Item label="Registration Date">
            {moment(householdDetail?.registration_date).format(
              `DD-MM-YYYY hh:mm:ss`
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(householdDetail?.created_at).format(`DD-MM-YYYY hh:mm:ss`)}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Ngày Update">
            {moment(HouseholdDetail?.updateAt).format(`DD-MM-YYYY hh:mm:ss`)}
          </Descriptions.Item> */}
        </Descriptions>
      </Drawer>
    </>
  );
};
export default HouseholdModalDetail;
