// components/html-generator.ts

export function generateComponentHtml(componentType: string, props: any): string {
  switch (componentType) {
    case "text":
      return `<div style="font-size: ${props.fontSize || 16}px; color: ${props.color || "#000000"};">${props.text || "Placeholder Text"}</div>`
    case "image":
      return `<img src="${props.src || "placeholder.jpg"}" alt="${props.alt || "Placeholder Image"}" width="${props.width || 200}" height="${props.height || 150}" />`
    case "button":
      return `<button style="background-color: ${props.backgroundColor || "#007bff"}; color: ${props.textColor || "#ffffff"}; padding: 10px 20px; border: none; cursor: pointer;">${props.buttonText || "Click Me"}</button>`
    case "button-grid":
      let buttonGridHtml = `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: ${props.padding || 16}px;">
  <tbody>`

      // Generate buttons
      for (let i = 0; i < (props.buttonCount || 3); i++) {
        const buttonText = props[`button${i + 1}Text`] || `Button ${i + 1}`
        buttonGridHtml += `
    <tr>
      <td style="padding-bottom: ${props.spacing || 8}px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <button style="background-color: ${props.buttonStyle === "filled" ? props.buttonColor || "#000000" : "transparent"}; 
                             color: ${
                               props.buttonStyle === "filled"
                                 ? props.buttonTextColor || "#ffffff"
                                 : props.buttonTextColor || "#000000"
                             }; 
                             width: 100%; 
                             height: auto; 
                             min-height: 48px; 
                             font-size: ${props.fontSize || 17}px; 
                             font-weight: ${props.fontWeight || "normal"}; 
                             line-height: ${props.lineHeight || 1.8}; 
                             letter-spacing: ${props.letterSpacing || "1.5px"}; 
                             border-width: ${
                               props.buttonStyle === "outlined"
                                 ? "1px"
                                 : props.buttonStyle === "underlined"
                                   ? "0 0 1px 0"
                                   : "0"
                             }; 
                             border-style: ${
                               props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none"
                             }; 
                             border-color: ${
                               props.buttonStyle === "outlined" || props.buttonStyle === "underlined"
                                 ? "#000000"
                                 : "transparent"
                             }; 
                             padding: ${props.buttonStyle === "underlined" ? "12px 24px 5px" : "12px 24px"}; 
                             text-decoration: none; 
                             white-space: pre-wrap;">
                ${buttonText}
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
      }

      buttonGridHtml += `
  </tbody>
</table>`
      return buttonGridHtml
    default:
      return `<div>Component type "${componentType}" not supported.</div>`
  }
}
