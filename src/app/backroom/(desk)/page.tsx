import { redirect } from "next/navigation";

export default function BackroomHome() {
  redirect("/backroom/orders");
}
