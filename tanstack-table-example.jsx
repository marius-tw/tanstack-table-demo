const {useState, useMemo} = React;
const {createRoot} = ReactDOM;

const {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} = window.ReactTable;

const defaultData = [
    {
        id: 1,
        fullName: { firstName: 'Tanner', lastName: 'Linsley' },
        address: { zipCode: '94107', street: '123 Main St', city: 'San Francisco', state: 'CA' },
        age: 30,
        lastLogin: new Date('2024-03-15T10:30:00Z'),
        status: 'Active',
        isAdmin: true,
        progress: 75,
    },
    {
        id: 2,
        fullName: { firstName: 'Jane', lastName: 'Doe' },
        address: { zipCode: '78701', street: '456 Oak Ave', city: 'Austin', state: 'TX' },
        age: 25,
        lastLogin: new Date('2024-05-20T14:00:00Z'),
        status: 'Pending',
        isAdmin: false,
        progress: 45,
    },
    {
        id: 3,
        fullName: { firstName: 'John', lastName: 'Smith' },
        address: { zipCode: '10001', street: '789 Pine Ln', city: 'New York', state: 'NY' },
        age: 42,
        lastLogin: new Date('2023-11-01T08:15:00Z'),
        status: 'Inactive',
        isAdmin: false,
        progress: 90,
    },
    {
        id: 4,
        fullName: { firstName: 'Kevin', lastName: 'Vandy' },
        address: { zipCode: '60601', street: '101 Maple Dr', city: 'Chicago', state: 'IL' },
        age: 35,
        lastLogin: new Date('2024-06-01T22:00:00Z'),
        status: 'Active',
        isAdmin: true,
        progress: 20,
    },
    {
        id: 5,
        fullName: { firstName: 'Emily', lastName: 'White' },
        address: { zipCode: '98101', street: '212 Birch Rd', city: 'Seattle', state: 'WA' },
        age: 28,
        lastLogin: new Date('2024-05-28T18:45:00Z'),
        status: 'Pending',
        isAdmin: false,
        progress: 100,
    },
];

const columnHelper = createColumnHelper();

function App() {
    const [data] = useState(() => [...defaultData]);
    const [sorting, setSorting] = useState([]);

    const columns = useMemo(() => [
        columnHelper.accessor(row => `${row.fullName.firstName} ${row.fullName.lastName}`, {
            id: 'fullName',
            header: 'Full Name',
            sorting: 'basic',
        }),
        columnHelper.accessor('age', {
            header: 'Age',
            meta: {
                isNumeric: true,
            },
        }),
        columnHelper.accessor('lastLogin', {
            header: 'Last Login',
            cell: info => info.getValue().toLocaleDateString(),
            sortingFn: 'datetime',
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                const colorClass =
                    status === 'Active' ? 'bg-green-500/20 text-green-400' :
                        status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400';
                return (
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                    {status}
                </span>
                );
            },
            sortingFn: (rowA, rowB, columnId) => {
                const sortOrder = ['Active', 'Pending', 'Inactive'];
                const statusA = rowA.getValue(columnId);
                const statusB = rowB.getValue(columnId);

                return sortOrder.indexOf(statusA) - sortOrder.indexOf(statusB);
            },
        }),
        columnHelper.accessor('isAdmin', {
            header: 'Admin',
            cell: info => (
                <div className="flex justify-center">
                    <div className={`w-3 h-3 rounded-full ${info.getValue() ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
                </div>
            ),
        }),
        columnHelper.accessor('progress', {
            header: 'Profile Progress',
            cell: info => {
                const value = info.getValue();
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-indigo-500 h-2.5 rounded-full"
                                style={{width: `${value}%`}}
                            ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-400 w-10 text-right">{value}%</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor(row => row.address, {
            header: 'ZipCode',
            cell: info => {
                const address = info.getValue();
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-400 w-10 text-right">{address.zipCode}</span>
                    </div>
                );
            },
            sortingFn: (rowA, rowB, columnId) => {
                return rowA.getValue(columnId).zipCode.localeCompare(rowB.getValue(columnId).zipCode);
            },
        }),
    ], []);
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-white">TanStack Table Example</h1>
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                        } ${header.column.getIsSorted() ? 'bg-gray-700' : ''}`}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted()] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-700/50 transition-colors duration-150">
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${cell.column.columnDef.meta?.isNumeric ? 'text-right font-mono' : 'text-left text-gray-300'}`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>);

