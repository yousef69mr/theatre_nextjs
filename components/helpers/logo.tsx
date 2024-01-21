import Image from "next/image";

const Logo = () => {
  return (
    <div className="w-8 h-8 relative cursor-pointer">
      {/* MY LOGO */}
      <Image fill priority alt="logo" src="/logo.png" sizes="32x32 64x64" />
    </div>
  );
};

export default Logo;
