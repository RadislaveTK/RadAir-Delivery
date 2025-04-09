import { Link } from "react-router-dom";

export default function Fotter() {

  return (
    <footer>
      <Link className="footer-link" to="/">
        <img width={35} height={35} src="/assets/icons/home.svg" />
      </Link>
      <Link className="footer-link" to="/">
        <img width={35} height={35} src="/assets/icons/searching.svg" />
      </Link>
      <Link className="footer-link" to="/">
        <img width={35} height={35} src="/assets/icons/bag.svg" />
      </Link>
    </footer>
  );
}
