const configImport = () => {
  it("Check behavior Load Assets/Annotations", () => {
    cy.log("check initial config")
    cy.wait(200)
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Load Assets").should("be.disabled")
    cy.contains("Load Annotations").should("not.be.disabled")

    cy.log("Check if type of import is kept")
    cy.contains("Load Annotations").click()
    cy.contains("Close").click()
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Load Assets").should("not.be.disabled")
    cy.contains("Load Annotations").should("be.disabled")

    cy.log("return to initial state")
    cy.contains("Load Assets").click()
    cy.contains("Close").click()
  })

  it("Check behavior setting/storage panel", () => {
    cy.log("Check if open on Storage panel")
    cy.wait(200)
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Annotation processing").should("not.exist")
    cy.contains("Choose file type").should("not.exist")

    cy.log("Check if able to change panel")
    cy.get("svg[id='SettingIcon']").click()
    cy.contains("Choose file type")
    cy.contains("Close").click()

    cy.log("check if stay in setting panel when closed")
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Choose file type")

    cy.log("Check if change setting for type of import")
    cy.contains("Load Annotations").click()
    cy.contains("Annotation processing")

    cy.log("return to initial state")
    cy.contains("Load Assets").click()
    cy.get("svg[id='StorageIcon']").click()
    cy.contains("Close").click()
  })

  /* to uncomment when the asset will added on export
        it("Check if disable non compatible type of file", () => {
        cy.wait(2000)
        cy.log("For Empty")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Empty")
        cy.get("input[name='select-row-3']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("be.checked")
        cy.get("input[value='Image']").should("not.be.disabled")
    
        cy.get("input[value='Video']").should("not.be.checked")
        cy.get("input[value='Video']").should("not.be.disabled")
    
        cy.get("input[value='Audio']").should("not.be.checked")
        cy.get("input[value='Audio']").should("not.be.disabled")
    
        cy.get("input[value='PDF']").should("not.be.checked")
        cy.get("input[value='PDF']").should("not.be.disabled")
    
        cy.get("input[value='Text']").should("not.be.checked")
        cy.get("input[value='Text']").should("not.be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })
    
      it("Check if disable non compatible type of file", () => {
        cy.log("For Image")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Image Classification")
        cy.get("input[name='select-row-4']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("be.checked")
        cy.get("input[value='Image']").should("not.be.disabled")
    
        cy.get("input[value='Video']").should("not.be.checked")
        cy.get("input[value='Video']").should("be.disabled")
    
        cy.get("input[value='Audio']").should("not.be.checked")
        cy.get("input[value='Audio']").should("be.disabled")
    
        cy.get("input[value='PDF']").should("not.be.checked")
        cy.get("input[value='PDF']").should("be.disabled")
        
        cy.get("input[value='Text']").should("not.be.checked")
        cy.get("input[value='Text']").should("be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })
    
      it("Check if disable non compatible type of file", () => {
        cy.log("For Audio")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Audio Transcription")
        cy.get("input[name='select-row-0']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("not.be.checked")
        cy.get("input[value='Image']").should("be.disabled")
    
        cy.get("input[value='Video']").should("not.be.checked")
        cy.get("input[value='Video']").should("be.disabled")
    
        cy.get("input[value='Audio']").should("be.checked")
        cy.get("input[value='Audio']").should("not.be.disabled")
    
        cy.get("input[value='PDF']").should("not.be.checked")
        cy.get("input[value='PDF']").should("be.disabled")
        
        cy.get("input[value='Text']").should("not.be.checked")
        cy.get("input[value='Text']").should("be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })
    
      it("Check if disable non compatible type of file", () => {
        cy.log("For Video")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Video Segmentation")
        cy.get("input[name='select-row-7']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("not.be.checked")
        cy.get("input[value='Image']").should("be.disabled")
    
        cy.get("input[value='Video']").should("be.checked")
        cy.get("input[value='Video']").should("not.be.disabled")
    
        cy.get("input[value='Audio']").should("not.be.checked")
        cy.get("input[value='Audio']").should("be.disabled")
    
        cy.get("input[value='PDF']").should("not.be.checked")
        cy.get("input[value='PDF']").should("be.disabled")
        
        cy.get("input[value='Text']").should("not.be.checked")
        cy.get("input[value='Text']").should("be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })
    
      it("Check if disable non compatible type of file", () => {
        cy.log("For Text")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Text Classification")
        cy.get("input[name='select-row-5']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("not.be.checked")
        cy.get("input[value='Image']").should("be.disabled")
    
        cy.get("input[value='Video']").should("not.be.checked")
        cy.get("input[value='Video']").should("be.disabled")
    
        cy.get("input[value='Audio']").should("not.be.checked")
        cy.get("input[value='Audio']").should("be.disabled")
    
        cy.get("input[value='PDF']").should("not.be.checked")
        cy.get("input[value='PDF']").should("be.disabled")
        
        cy.get("input[value='Text']").should("be.checked")
        cy.get("input[value='Text']").should("not.be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })
    
      it("Check if disable non compatible type of file", () => {
        cy.log("For PDF")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Data Entry")
        cy.get("input[name='select-row-1']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("not.be.checked")
        cy.get("input[value='Image']").should("be.disabled")
    
        cy.get("input[value='Video']").should("not.be.checked")
        cy.get("input[value='Video']").should("be.disabled")
    
        cy.get("input[value='Audio']").should("not.be.checked")
        cy.get("input[value='Audio']").should("be.disabled")
    
        cy.get("input[value='PDF']").should("be.checked")
        cy.get("input[value='PDF']").should("not.be.disabled")
        
        cy.get("input[value='Text']").should("not.be.checked")
        cy.get("input[value='Text']").should("be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })
    
      it("Check if disable non compatible type of file", () => {
        cy.log("For Time")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Time Series")
        cy.get("input[name='select-row-6']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("not.be.checked")
        cy.get("input[value='Image']").should("be.disabled")
    
        cy.get("input[value='Video']").should("not.be.checked")
        cy.get("input[value='Video']").should("be.disabled")
    
        cy.get("input[value='Audio']").should("not.be.checked")
        cy.get("input[value='Audio']").should("be.disabled")
    
        cy.get("input[value='PDF']").should("not.be.checked")
        cy.get("input[value='PDF']").should("be.disabled")
        
        cy.get("input[value='Text']").should("not.be.checked")
        cy.get("input[value='Text']").should("be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })
    
      it("Check if disable non compatible type of file", () => {
        cy.log("For Other File(unsupported)")
        cy.contains("Import from S3 (Cognito)").click()
        cy.contains("Not Supported")
        cy.get("input[name='select-row-4']").click()
        cy.get("svg[id='SettingIcon']").click()
    
        cy.get("input[value='Image']").should("not.be.checked")
        cy.get("input[value='Image']").should("be.disabled")
    
        cy.get("input[value='Video']").should("not.be.checked")
        cy.get("input[value='Video']").should("be.disabled")
    
        cy.get("input[value='Audio']").should("not.be.checked")
        cy.get("input[value='Audio']").should("be.disabled")
    
        cy.get("input[value='PDF']").should("not.be.checked")
        cy.get("input[value='PDF']").should("be.disabled")
        
        cy.get("input[value='Text']").should("not.be.checked")
        cy.get("input[value='Text']").should("be.disabled")
    
        cy.get("svg[id='StorageIcon']").click()
        cy.contains("Close").click()
      })*/

  it("Check if disable import when project not selected", () => {
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Take samples from project").should("be.disabled")
    cy.get("input[name='select-row-0']").click()
    cy.contains("Take samples from project").should("not.be.disabled")
    cy.contains("Close").click()
  })
}
export default configImport
