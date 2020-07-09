import React from "react";
import { Table } from "antd";

const columns = [
  {
    title: "Anagram",
    dataIndex: "Anagram",
    key: "Anagram",
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
    sorter: {
      compare: (a, b) => {
        const nameA = a.Name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.Name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      },
    },
  },
  {
    title: "%",
    dataIndex: "%",
    key: "%",
    width: 150,
    defaultSortOrder: "descend",
    sorter: {
      compare: (a, b) => a["%"] - b["%"],
    },
    // onFilter: (value, record) => record.name.indexOf(value) === 0,
    // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => null,
  },
];

export default function ResultsTable({
  fetchingTableDataStatus,
  filteredtableData,
}) {
  return (
    <Table
      loading={fetchingTableDataStatus}
      dataSource={filteredtableData}
      columns={columns}
    />
  );
}
