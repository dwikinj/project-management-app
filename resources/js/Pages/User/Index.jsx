import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";
import Swal from "sweetalert2";


export default function Index({ auth, users, queryParams = null, success }) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("user.index"), queryParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;

    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }

    router.get(route("user.index"), queryParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const deleteUser = (user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('user.destroy', user.id), {
          onSuccess: () => {
            Swal.fire(
              'Deleted!',
              `user "${user.name}" has been deleted.`,
              'success'
            )
          },
          onError: () => {
            Swal.fire(
              'Error!',
              'There was a problem deleting the user.',
              'error'
            )
          }
        });
      }
    });
  };


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Users
          </h2>
          <Link href={route("user.create")} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            Add New
          </Link>
        </div>
      }
      
    >
 
      <Head title="Users" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
              {success}
            </div>
          )}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="overflow-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2">
                  <tr className="text-nowrap">

                    <TableHeading name="id" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                      ID
                    </TableHeading>
                  

                    <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                      Name
                    </TableHeading>

                    <TableHeading name="email" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                      Email
                    </TableHeading>

                    <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}  onSort={sortChanged}>
                        Created Date
                    </TableHeading>

                    <TableHeading sortable={false}>
                        Actions
                    </TableHeading>
                  </tr>
                </thead>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2">
                  <tr className="text-nowrap">
                    <th className="px-3 py-2"></th>
                    <th className="px-3 py-2">
                      <TextInput
                        className="w-full"
                        placeholder="User Name"
                        defaultValue={queryParams.name}
                        onBlur={(e) =>
                          searchFieldChanged("name", e.target.value)
                        }
                        onKeyPress={(e) => onKeyPress("name", e)}
                      />
                    </th>
            
                    <th className="px-3 py-2">
                    <TextInput
                        className="w-full"
                        placeholder="User Email"
                        defaultValue={queryParams.email}
                        onBlur={(e) =>
                          searchFieldChanged("email", e.target.value)
                        }
                        onKeyPress={(e) => onKeyPress("email", e)}
                      />
                    </th>
                    <th className="px-3 py-2"> </th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.data.map((user) => (
                    <tr className="bg-white border-b" key={user.id}>
                      <td className="px-3 py-3">{user.id}</td>
                      <td className="px-3 py-3text-nowrap">
                          {user.name}
                      </td>
                      <td className="px-3 py-3">{user.email}</td>
                      <td className="px-3 py-3 text-nowrap">
                        {user.created_at}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={route("user.edit", user.id)}
                          className="font-medium text-blue-600 hover:underline mx-1"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={()=>deleteUser(user)}
                          className="font-medium text-red-600 hover:underline mx-1"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination links={users.meta.links} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
