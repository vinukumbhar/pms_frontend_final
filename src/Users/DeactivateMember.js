import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { IconButton, Box, Typography } from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
const DeactivateMember = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const handleRestoreMember = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to Restore this account ?");
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        active: true,
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(id);

          fetchDeactivateData();
          toast.success("Team Member Activated Successfully");
        })
        .catch((error) => console.error(error));
    }
  };

  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchDeactivateData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const url = `${LOGIN_API}/admin/teammember/teammemberlist/list/false`;

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      setTeamMembers(result.teamMemberslist);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDeactivateData();
  }, []);
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "FirstName",
        header: "Name",
        Cell: ({ row }) => {
          const firstName = row.original?.FirstName;
          const middleName = row.original?.MiddleName;
          const lastName = row.original?.LastName;
          const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;
          return (
            <div>
              <div className="circle">{initials}</div>
              <Link to={`/updateteammember/${row.original?.id}`}>{`${firstName ? firstName : ""}  ${middleName ? middleName : ""} ${lastName ? lastName : ""}`}</Link>{" "}
            </div>
          );
        },
      },
      { accessorKey: "Email", header: "Email" },
      { accessorKey: "Role", header: "Role" },
      {
        accessorKey: "Created",
        header: "Created",
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          const date = new Date(dateValue);

          if (isNaN(date)) {
            return "Invalid Date";
          }

          return date
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
            .replace(",", "");
        },
      },
      { accessorKey: "has2FA", header: "2FA", Cell: ({ value }) => (value ? "Enabled" : "Disabled") },
      {
        accessorKey: "Actions",
        header: "Actions",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => toggleMenu(row.original.id)}
            style={{ color: "#2c59fa", position: "relative" }} // Added position relative for proper positioning
          >
            <CiMenuKebab style={{ fontSize: "25px" }} />
            {openMenuId === row.original.id && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 10, // Ensure it's on top of other elements
                  backgroundColor: "#fff",
                  boxShadow: 1,
                  borderRadius: 1,
                  p: 1,
                  left: "30px",
                  m: 2,
                }}
              >
                <Typography
                  onClick={() => {
                    handleRestoreMember(row.original.id);
                  }}
                  sx={{ fontSize: "12px", color: "blue", fontWeight: "bold" }}
                >
                  Restore
                </Typography>
              </Box>
            )}
          </IconButton>
        ),
      },
    ],
    [openMenuId]
  );

  const table = useMaterialReactTable({
    columns,
    data: teamMembers,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MaterialReactTable table={table} />
      <ToastContainer />
    </div>
  );
};

export default DeactivateMember;
