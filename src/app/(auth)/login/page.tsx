import SignInForm from "~/components/ui/signup-form";

function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-base-100">
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
export default LoginPage;
