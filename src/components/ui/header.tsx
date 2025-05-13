import logo from "@/assets/logo.png";

export default function Header() {
  return (
    <header className="flex items-center p-4 shadow-md">
      <img src={logo} alt="Company Logo" className="h-10 w-auto" />
      <h1 className="ml-4 text-xl font-semibold">Chick-In Waffle</h1>
    </header>
  );
}

