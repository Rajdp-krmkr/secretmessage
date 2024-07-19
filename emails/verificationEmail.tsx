import { Html, Head, Font, Preview, Heading, Row, Section, Text, Button } from "@react-email/components";

interface verificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: verificationEmailProps) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>Verification Code</title>
      </head>
      <Preview>Here&apos;s your verification code: {otp}  </Preview>
      <section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>Thank you for registering. Please use the following verification code to complete your registration:</Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
      </section> 
    </html>
  )


}