import { cookies } from "next/headers";
import LoginForm from "./form-signIn";
import { redirect } from "next/navigation";
type SearchParams = Promise<{ [key: string]: string | undefined }>;
async function LoginPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const callbackurl = searchParams.callbackUrl;
  const session = await cookies();
  if (session.get("session")) {
    redirect(callbackurl ? callbackurl : "/");
  }
  return (
    <main>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
export default LoginPage;
