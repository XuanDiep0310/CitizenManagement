import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ViewDetailHousehold from "./ViewDetailHousehold";
import {
  callHouseholdAPI,
  callHouseholdMembersdAPI,
  deleteHouseholdAPI,
} from "../../../services/api.service";
import { notification } from "antd";

const HouseholdDetail = () => {
  const [dataHousehold, setHousehold] = useState();
  const [dataHouseholdMembers, setHouseholdMembers] = useState();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get(`id`);

  const handleDelete = async () => {
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
  const fetchHousehold = async (id) => {
    const resHouse = await callHouseholdAPI(id);
    const resMembers = await callHouseholdMembersdAPI(id);
    if (resHouse && resHouse.data) {
      setHousehold(resHouse.data);
    }
    if (resMembers && resMembers.data) {
      setHouseholdMembers(resMembers.data);
    }
  };
  useEffect(() => {
    fetchHousehold(id);
  }, [id]);

  return (
    <>
      <ViewDetailHousehold
        dataHousehold={dataHousehold}
        dataHouseholdMembers={dataHouseholdMembers}
        handleDelete={handleDelete}
      />
    </>
  );
};
export default HouseholdDetail;
