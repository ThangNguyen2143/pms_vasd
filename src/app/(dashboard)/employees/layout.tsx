import NavLink from "~/components/employees/nav-link";

function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavLink />
      {children}
    </div>
  );
}

export default EmployeeLayout;
