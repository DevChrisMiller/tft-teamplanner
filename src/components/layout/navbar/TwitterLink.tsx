import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function TwitterLink() {
  return (
    <Link href="https://x.com/DevChrisMiller" target="_blank">
      <FontAwesomeIcon icon={faXTwitter} className="h-6 w-6" />
    </Link>
  );
}
