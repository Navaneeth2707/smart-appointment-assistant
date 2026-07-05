import "./globals.css";

export const metadata = {
  title: "Dental Assistant",
  description: "AI Appointment Booking"
};

export default function RootLayout({
  children,
}:{
  children:React.ReactNode
}){

  return(

<html lang="en">

<body>

{children}

</body>

</html>

  )

}