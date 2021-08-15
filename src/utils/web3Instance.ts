import Web3 from "web3";

class Web3Class {
  private static web3: Web3 ;

  public static async init():Promise<Web3> {
    return new Promise(async (resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          this.web3 = web3
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:9545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  }

  public static async getInstance() {
    if (this.web3) {
      
      return this.web3;
    }
    return await this.init();
    
  }
}

export default Web3Class;
