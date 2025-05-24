import SignInForm from "./signin-form";
type SearchParams = Promise<{ [key: string]: string | undefined }>;
async function LoginPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const callbackurl = searchParams.callbackUrl;

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
          <SignInForm callbackUrl={callbackurl} />
        </div>
      </div>
    </main>
  );
}
export default LoginPage;
