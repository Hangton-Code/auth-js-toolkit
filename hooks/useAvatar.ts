import { useSession } from "next-auth/react";

type Avatar = {
  type: "Picture" | "Generate By Name";
  url: string;
};

export const useAvatar = (): Avatar => {
  const session = useSession();

  const picture = session.data?.user.image;
  if (picture)
    return {
      type: "Picture",
      url: picture,
    };

  const name = session.data?.user.name;
  const params = new URLSearchParams();
  params.append("name", name || "HCL");
  return {
    type: "Generate By Name",
    url: `https://ui-avatars.com/api/?${params.toString()}`,
  };
};
