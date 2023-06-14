import '../styles/globals.css'
import '../styles/animate.css'
import '../styles/custom.css'
import '../styles/faq.css'
import '../styles/planets.css'
import '../styles/flip.css'
import '../styles/responsive.css'

import { StatusProvider } from "../context/statusContext"






function MyApp({ Component, pageProps }) {
  
  return (
    <StatusProvider>
      <Component {...pageProps}   />
    </StatusProvider>
  )
}

export default MyApp
