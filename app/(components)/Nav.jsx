"use client";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

// Navigation component
const Nav = () => {
  // Fetch user session
  const { data: session } = useSession();
  // State for authentication providers
  const [providers, setProviders] = useState(null);
  // State for toggling dropdown menu in mobile view
  const [toggleDropdown, setToggleDropdown] = useState(false);

  // Fetch available authentication providers on component mount
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <nav className="flex justify-between items-center w-full mb-16 pt-3">
      {/* Home link */}
      <Link href="/" className="flex gap-2 justify-center items-center">
        <FontAwesomeIcon icon={faHome} className="icon size-8" />
      </Link>

      {/* Desktop navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          // If user is signed in
          <div className="flex gap-3 md:gap-5">
            <Link href="/ViewFiles" className="black_btn">
              View Files
            </Link>
            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out
            </button>
            <Link href="/profile">
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          // If user is not signed in, display sign in buttons for available providers
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          // If user is signed in
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              // Dropdown menu for signed-in user in mobile view
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/ViewFiles"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  View Files
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          // If user is not signed in, display sign in buttons for available providers
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
