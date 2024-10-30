import { Link } from "react-router-dom";
import { ERoutes } from "@/@types/links";
import { Sun } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-400 py-9 md:py-5 px-2">
      <div className="flex flex-col gap-4 md:flex-row justify-between items-center mx-auto md:container">
        <span className="text-2xl text-white font-bold tracking-tight">
          <Link to={ERoutes.home} className="flex items-center gap-2">
            <Sun
              color="#ffffff"
              strokeWidth={5}
              absoluteStrokeWidth
              size={54}
            />
            BookingHoliday
          </Link>
        </span>
        <div className="flex items-center justify-end text-white">
          <a
            href="https://www.vladimir-monarov.com/"
            target="_blank"
            rel="noreferrer"
          >
            <p>&copy;2022 DodaDesign All Rights Reserved</p>
          </a>
        </div>
      </div>
    </footer>
  );
}
