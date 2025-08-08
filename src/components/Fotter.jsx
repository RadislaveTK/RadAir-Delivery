import { Link } from "react-router-dom";

export default function Fotter() {

  return (
    <footer>
      <Link className="footer-link" to="/">
        <img width={35} height={35} src="/assets/icons/home.svg" alt="Icon"/>
      </Link>
      <Link className="footer-link" to="/search">
        <img width={35} height={35} src="/assets/icons/searching.svg" alt="Icon"/>
      </Link>
      <Link className="footer-link" to="/">
        <img width={35} height={35} src="/assets/icons/bag.svg" alt="Icon"/>
      </Link>
    </footer>
  );
}
