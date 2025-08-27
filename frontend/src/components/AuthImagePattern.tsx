interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}

const AuthImagePattern: React.FC<AuthImagePatternProps> = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center min-h-screen w-full bg-purple-600/40">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-purple-500 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-5 text-white">{title}</h2>
        <p className="text-lg text-white/90">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
