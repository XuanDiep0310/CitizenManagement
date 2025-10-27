// import { useEffect, useState } from "react";
// import {
//   Table,
//   Input,
//   Button,
//   Tag,
//   Popconfirm,
//   Space,
//   message,
//   notification,
// } from "antd";
// import {
//   PlusOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import {} from "../../../services/api.service";
// import "../../../assets/styles/householdTable.scss";
// import HouseholdModalDetail from "./HouseholdModalDetail";
// // import HouseholdModalDetail from "./HouseholdModalDetail";
// // import HouseholdModalCreate from "./HouseholdModalCreate";

// const ResidenceTable = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pageSize, setPageSize] = useState(5);
//   const [current, setCurrent] = useState(1);
//   const [total, setTotal] = useState(100);
//   const [residence, setResidence] = useState([]);
//   const [loadingTable, setLoadingTable] = useState(false);

//   // const [sortQuery, setSortQuery] = useState("");
//   // const [filter, setFilter] = useState("");

//   // const [isModalImportOpen, setIsModalImportOpen] = useState(false);
//   const fetchResidence = async () => {
//     setLoadingTable(true);
//     let query = `page=${current}&pageSize=${pageSize}`;
//     // if (filter) {
//     //   query += `${filter}`;
//     // }
//     // if (sortQuery) {
//     //   query += `&${sortQuery}`;
//     // }
//     if (searchTerm) {
//       query += `&searchTerm=${searchTerm}`;
//     }
//     const res = await callListResidenceAPI(query);
//     if (res && res.data) {
//       setCurrent(+res.pagination.page);
//       setPageSize(+res.pagination.pageSize);
//       setTotal(res.pagination.totalCount);
//       setResidence(res.data);
//     }
//     setLoadingTable(false);
//   };

//   useEffect(() => {
//     fetchResidence();
//   }, [current, pageSize, searchTerm]);
//   // , sortQuery, filter

//   const handleOnChangePagi = (pagination, filters, sorter) => {
//     if (
//       pagination &&
//       pagination.pageSize &&
//       +pagination.pageSize !== +pageSize
//     ) {
//       setPageSize(+pagination.pageSize);
//       setCurrent(1);
//     }

//     if (pagination && pagination.current && +pagination.current !== +current) {
//       setCurrent(+pagination.current);
//       console.log(pagination.current);
//     }
//     if (sorter && sorter.order) {
//       // const q =
//       //   sorter.order === "ascend"
//       //     ? `sort=${sorter.field}`
//       //     : `sort=-${sorter.field}`;
//       // if (q) setSortQuery(q);
//     }
//   };

//   // const handleExport = () => {
//   //   if (userData.length > 0) {
//   //     const worksheet = XLSX.utils.json_to_sheet(userData);
//   //     const workbook = XLSX.utils.book_new();
//   //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//   //     XLSX.writeFile(workbook, "ExportUser.xlsx");
//   //   }
//   // };
//   const handleView = (record) => {};
//   const handleEdit = (id) => {
//     message.info(`Edit household: ${id}`);
//   };
//   const handleDelete = async (id) => {
//     const res = await deleteResidenceAPI(id);
//     console.log(res);
//     if (res && res.success === true) {
//       notification.success({
//         message: "Delete Household",
//         description: "success!",
//       });
//       await fetchResidence();
//     } else {
//       notification.error({
//         message: "error",
//         description: JSON.stringify(res.error.message),
//       });
//     }
//   };
//   const columns = [
//     {
//       title: "Household Number",
//       dataIndex: "household_code",
//       key: "household_code",
//       // ellipsis: true,
//       render: (t) => <span style={{ fontWeight: 500 }}>{t}</span>,
//     },
//     {
//       title: "Household Head",
//       dataIndex: "head_full_name",
//       key: "head_full_name",
//       ellipsis: true,
//     },
//     {
//       title: "Address",
//       dataIndex: "address",
//       key: "address",
//       width: 500,
//       ellipsis: true,
//     },
//     {
//       title: "Members",
//       dataIndex: "member_count",
//       key: "member_count",
//       render: (s) => (
//         <Tag color="blue" style={{ fontWeight: 600 }}>
//           {s} Members
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       fixed: "right",
//       width: 160,
//       render: (_, r) => (
//         <Space>
//           <Button
//             type="text"
//             icon={<EyeOutlined />}
//             onClick={() => handleView(r)}
//           />
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(r.id)}
//           />
//           <Popconfirm
//             title="Delete citizen"
//             description="Are you sure you want to delete this citizen?"
//             okType="danger"
//             onConfirm={() => handleDelete(r.household_id)}
//           >
//             <Button type="text" danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="household-container">
//         <div className="page-header">
//           <div className="header-content">
//             <h1 className="page-title">Households</h1>
//             <p className="page-subtitle">
//               Manage household records and members
//             </p>
//           </div>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             // onClick={() => setIsCreateOpen(true)}
//           >
//             New Household
//           </Button>
//         </div>

//         <div className="content-card">
//           <div className="card-header">
//             <div className="card-header-text">
//               <h2 className="card-title">Household Records</h2>
//               <p className="card-subtitle">
//                 View and manage all household information
//               </p>
//             </div>
//           </div>

//           <div
//             style={{
//               marginBottom: 16,
//               display: "flex",
//               gap: 20,
//               width: "100%",
//             }}
//           >
//             <Input
//               allowClear
//               placeholder="Search by household or ID number or Address"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//               }}
//               prefix={<SearchOutlined />}
//               // style={{ flex: 1, minWidth: 0 }}
//             />
//           </div>

//           <Table
//             rowKey="id"
//             columns={columns}
//             dataSource={residence}
//             loading={loadingTable}
//             onChange={handleOnChangePagi}
//             pagination={{
//               current,
//               pageSize,
//               total,
//               showSizeChanger: true,
//               pageSizeOptions: [5, 10, 20, 50],

//               showTotal: (total, range) =>
//                 `${range[0]}-${range[1]} trên ${total} rows`,
//             }}
//             scroll={{ x: 900 }}
//             size="middle"
//             sticky
//           />
//         </div>
//       </div>
//     </>
//   );
// };
// export default ResidenceTable;
