import Amplify, { Auth } from "aws-amplify"
class AWS extends React.Component{
  authConfig = null
  user = null
  setConfig(config){
    try {
      Amplify.configure(config)

      Auth.currentAuthenticatedUser()
        .then((tryUser) => {
          this.user=tryUser
          this.authConfig=config
        })
        .catch((err) => {
          this.authConfig=config
        })
    } catch (err) {
      this.authConfig=null
    }

  }
}
const aws = new AWS();
  
export default aws;