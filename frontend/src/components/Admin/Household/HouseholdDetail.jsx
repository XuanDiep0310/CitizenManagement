import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ViewDetail from "./ViewDetail";

const HouseholdDetail = () => {
  const [dataBook, setDataBook] = useState();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get(`id`);

  const fetchBook = async (id) => {
    // const res = await getBookAPI(id);
    // if (res.data) {
    //   let raw = res.data;
    //   raw.items = getImages(raw);
    //   setTimeout(() => {
    //     setDataBook(raw);
    //   }, 1000);
    // }
  };
  useEffect(() => {
    // fetchBook(id);
  }, [id]);

  return (
    <>
      <ViewDetail dataBook={dataBook} />
    </>
  );
};
export default HouseholdDetail;
