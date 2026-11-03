import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { Icon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-column">
          <BrandMark />
          <p>Local people, doing good things together.</p>
          <span className="footer-location"><Icon name="mapPin" size={15} /> Made for neighbourhoods in Dhaka</span>
        </div>
        <div className="footer-nav-column">
          <h2>Explore</h2>
          <Link href="/upcoming-events">Upcoming events</Link>
          <Link href="/create-event">Start an initiative</Link>
          <Link href="/dashboard">Volunteer dashboard</Link>
        </div>
        <div className="footer-nav-column">
          <h2>About SocialSpark</h2>
          <p>Find a place to help, bring a neighbour, and keep local care moving.</p>
          <span className="footer-placeholder">Community contact details coming soon</span>
        </div>
        <div className="footer-social-column">
          <h2>Stay connected</h2>
          <span className="social-placeholder"><Icon name="xBrand" size={17} /> Social links coming soon</span>
          <span className="footer-small-note">No external profile has been connected yet.</span>
        </div>
      </div>
      <div className="footer-credits">
        <span>© 2026 SocialSpark · A frontend preview with local demo data</span>
        <span className="image-credits">
          Image credits: <a href="https://commons.wikimedia.org/wiki/File:Sure_We_Can_Earthday_clean_2021.jpg" target="_blank" rel="noreferrer">Wil540 art, CC BY-SA 4.0</a>; <a href="https://commons.wikimedia.org/wiki/File:U_S_volunteers_join_Okinawans_in_city_clean_up_(9305828).jpg" target="_blank" rel="noreferrer">U.S. Air Force, public domain</a>.
        </span>
      </div>
    </footer>
  );
}
