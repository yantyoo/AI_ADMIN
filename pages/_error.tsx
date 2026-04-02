import type { NextPageContext } from "next";

type ErrorPageProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorPageProps) {
  return <p>{statusCode ? `Error ${statusCode}` : "An unexpected error occurred."}</p>;
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? (err ? 500 : 404);
  return { statusCode };
};

export default ErrorPage;
