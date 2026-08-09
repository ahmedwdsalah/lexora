import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google],
  callbacks: {
    async redirect({ redirectTo }) {
      if (redirectTo === "lexora://") return redirectTo;
      if (redirectTo.startsWith("/") || redirectTo.startsWith("https://grandiose-clownfish-180.convex.site")) {
        return redirectTo;
      }
      throw new Error(`Invalid redirect target: ${redirectTo}`);
    },
  },
});
