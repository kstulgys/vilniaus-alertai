import Link from "next/link";
import axios from "axios";

export default function Index({ data }) {
  console.log({ data });
  return (
    <div>
      Hello World.{" "}
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}

Index.getInitialProps = async () => {
  const { data = [] } = await axios.get(
    "https://api.vilnius.lt/get-vilnius-gyvai/getmessages"
  );

  return { data };
};
