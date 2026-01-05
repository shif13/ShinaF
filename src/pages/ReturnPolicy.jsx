const ReturnPolicy = () => {
  return (
    <>
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <h1 className="text-4xl font-display font-bold text-brown-900">
            Return & Exchange Policy
          </h1>
          <p className="text-brown-600 mt-2">30-day hassle-free returns</p>
        </Container>
      </Section>

      <Section>
        <Container size="sm">
          <div className="prose prose-brown max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Return Eligibility
              </h2>
              <p className="text-brown-700 leading-relaxed mb-3">
                You can return most items within 30 days of delivery if:
              </p>
              <ul className="list-disc pl-6 text-brown-700 space-y-2">
                <li>Items are unused and in original packaging</li>
                <li>Tags and labels are attached</li>
                <li>Items are not damaged or altered</li>
                <li>You have the original receipt or order number</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Non-Returnable Items
              </h2>
              <ul className="list-disc pl-6 text-brown-700 space-y-2">
                <li>Intimate apparel and innerwear</li>
                <li>Sale or clearance items</li>
                <li>Gift cards</li>
                <li>Personalized or custom-made items</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Return Process
              </h2>
              <ol className="list-decimal pl-6 text-brown-700 space-y-2">
                <li>Log into your account and go to Order History</li>
                <li>Select the item(s) you want to return</li>
                <li>Choose return or exchange</li>
                <li>Pack the items securely in original packaging</li>
                <li>Ship using the provided return label</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Refund Timeline
              </h2>
              <p className="text-brown-700 leading-relaxed">
                Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
