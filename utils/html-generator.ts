import type { EmailComponent } from "@/types/email-builder"

// Helper function to generate inline CSS from style object
const generateInlineStyle = (styles: Record<string, string | number>): string => {
  return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
      return `${cssKey}: ${value};`
    })
    .join(" ")
}

// Generate HTML for a specific component
const generateComponentHtml = (component: EmailComponent): string => {
  const props = component.props || {}

  switch (component.type) {
    case "brand-header":
      return `
<table width="650" cellpadding="0" cellspacing="0" border="0">
  <tbody>
    <tr>
      <td height="${props.spacingTop || 30}" bgcolor="${props.backgroundColor || "#ffffff"}"></td>
    </tr>
    <tr>
      <td height="${props.borderHeight || 3}" bgcolor="${props.borderColor || "#000000"}"></td>
    </tr>
    <tr>
      <td height="${props.spacingBottom || 30}"></td>
    </tr>
    <tr>
      <td bgcolor="${props.backgroundColor || "#ffffff"}">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td width="20"></td>
              <td align="center">
                <a href="#" target="_blank" style="text-decoration: none; font-weight: normal; color: #000000;" rel="noreferrer">
                  <img src="${props.logoUrl || "https://link.email.lkbennett.com/custloads/816689973/vce/logo1.png"}" 
                       alt="${props.logoAlt || "LK Bennett London"}" 
                       style="display: block; width: ${props.logoWidth || 218}px; border: 0;" />
                </a>
              </td>
              <td width="20"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td height="${props.spacingBottom || 30}"></td>
    </tr>
  </tbody>
</table>`

    case "header-banner":
      return `
<div style="background-color: ${props.backgroundColor || "#f8f9fa"}; 
            color: ${props.textColor || "#000000"}; 
            padding: ${props.padding || 16}px; 
            border-radius: ${props.borderRadius || 0}px; 
            border-width: ${props.borderWidth ? `${props.borderWidth}px` : 0}; 
            border-style: ${props.borderWidth ? "solid" : "none"}; 
            border-color: ${props.borderColor || "#cccccc"}; 
            font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
            text-align: center;">
  <h2 style="font-size: ${props.fontSize || 35}px; 
             font-weight: ${props.fontWeight || "normal"}; 
             line-height: ${props.lineHeight || 1}; 
             letter-spacing: ${props.letterSpacing || "2px"};">
    ${props.title || "Header Title"}
  </h2>
</div>`

    case "text-section":
      return `
<div style="background-color: ${props.backgroundColor || "#ffffff"}; 
            color: ${props.textColor || "#000000"}; 
            padding: ${props.padding || 16}px; 
            border-radius: ${props.borderRadius || 0}px; 
            border-width: ${props.borderWidth ? `${props.borderWidth}px` : 0}; 
            border-style: ${props.borderWidth ? "solid" : "none"}; 
            border-color: ${props.borderColor || "#cccccc"}; 
            font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
            text-align: ${props.textAlign || "center"};">
  <p style="font-size: ${props.fontSize || 17}px; 
            font-weight: ${props.fontWeight || "normal"}; 
            font-style: ${props.italic ? "italic" : "normal"}; 
            text-decoration: ${props.underline ? "underline" : "none"}; 
            text-align: ${props.textAlign || "center"}; 
            line-height: ${props.lineHeight || 1.8}; 
            letter-spacing: ${props.letterSpacing || "2px"}; 
            white-space: pre-wrap;">
    ${props.text || "Text content goes here"}
  </p>
</div>`

    case "full-width-image":
      return `
<div style="padding: ${props.padding || 0}px; 
            border-radius: ${props.borderRadius || 0}px; 
            border-width: ${props.borderWidth ? `${props.borderWidth}px` : 0}; 
            border-style: ${props.borderWidth ? "solid" : "none"}; 
            border-color: ${props.borderColor || "#cccccc"}; 
            overflow: hidden; 
            width: 100%;">
  <img src="${props.imageUrl || "/placeholder.jpg"}" 
       alt="${props.imageAlt || "Full width image"}" 
       style="border-radius: ${props.borderRadius || 0}px; width: 100%;" />
</div>`

    case "two-column-images":
      const spacing = props.spacing || 8
      const buttonStyle1 = props.showButtons
        ? `
  <button style="background-color: ${props.buttonStyle === "filled" ? props.buttonColor || "#4285F4" : "transparent"}; 
                 color: ${
                   props.buttonStyle === "filled"
                     ? props.buttonTextColor || "#ffffff"
                     : props.buttonTextColor || "#000000"
                 }; 
                 width: 100%; 
                 height: auto; 
                 min-height: 48px; 
                 font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
                 font-size: ${props.fontSize || 17}px; 
                 font-weight: ${props.fontWeight || "normal"}; 
                 letter-spacing: ${props.letterSpacing || "1.5px"}; 
                 border-width: ${
                   props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0"
                 }; 
                 border-style: ${
                   props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none"
                 }; 
                 border-color: ${
                   props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "#000000" : "transparent"
                 }; 
                 padding: 12px 24px; 
                 text-decoration: none;">
    ${props.button1Text || "Shop Now"}
  </button>`
        : ""

      const buttonStyle2 = props.showButtons
        ? `
  <button style="background-color: ${props.buttonStyle === "filled" ? props.buttonColor || "#4285F4" : "transparent"}; 
                 color: ${
                   props.buttonStyle === "filled"
                     ? props.buttonTextColor || "#ffffff"
                     : props.buttonTextColor || "#000000"
                 }; 
                 width: 100%; 
                 height: auto; 
                 min-height: 48px; 
                 font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
                 font-size: ${props.fontSize || 17}px; 
                 font-weight: ${props.fontWeight || "normal"}; 
                 letter-spacing: ${props.letterSpacing || "1.5px"}; 
                 border-width: ${
                   props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0"
                 }; 
                 border-style: ${
                   props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none"
                 }; 
                 border-color: ${
                   props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "#000000" : "transparent"
                 }; 
                 padding: 12px 24px; 
                 text-decoration: none;">
    ${props.button2Text || "Learn More"}
  </button>`
        : ""

      return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: ${props.padding || 0}px; 
                                                                       border-radius: ${props.borderRadius || 0}px; 
                                                                       border-width: ${
                                                                         props.borderWidth
                                                                           ? `${props.borderWidth}px`
                                                                           : 0
                                                                       }; 
                                                                       border-style: ${
                                                                         props.borderWidth ? "solid" : "none"
                                                                       }; 
                                                                       border-color: ${
                                                                         props.borderColor || "#cccccc"
                                                                       };">
  <tr>
    <td width="50%" style="padding: ${spacing / 2}px;">
      <img src="${props.image1Url || "/placeholder.jpg"}" 
           alt="${props.image1Alt || "Image 1"}" 
           style="width: 100%; height: auto;" />
      ${buttonStyle1}
    </td>
    <td width="50%" style="padding: ${spacing / 2}px;">
      <img src="${props.image2Url || "/placeholder.jpg"}" 
           alt="${props.image2Alt || "Image 2"}" 
           style="width: 100%; height: auto;" />
      ${buttonStyle2}
    </td>
  </tr>
</table>`

    case "three-column-images":
      const threeColSpacing = props.spacing || 8
      return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: ${props.padding || 0}px; 
                                                                       border-radius: ${props.borderRadius || 0}px; 
                                                                       border-width: ${
                                                                         props.borderWidth
                                                                           ? `${props.borderWidth}px`
                                                                           : 0
                                                                       }; 
                                                                       border-style: ${
                                                                         props.borderWidth ? "solid" : "none"
                                                                       }; 
                                                                       border-color: ${
                                                                         props.borderColor || "#cccccc"
                                                                       };">
  <tr>
    <td width="33.33%" style="padding: ${threeColSpacing / 2}px;">
      <img src="${props.image1Url || "/placeholder.jpg"}" 
           alt="${props.image1Alt || "Image 1"}" 
           style="width: 100%; height: auto;" />
    </td>
    <td width="33.33%" style="padding: ${threeColSpacing / 2}px;">
      <img src="${props.image2Url || "/placeholder.jpg"}" 
           alt="${props.image2Alt || "Image 2"}" 
           style="width: 100%; height: auto;" />
    </td>
    <td width="33.33%" style="padding: ${threeColSpacing / 2}px;">
      <img src="${props.image3Url || "/placeholder.jpg"}" 
           alt="${props.image3Alt || "Image 3"}" 
           style="width: 100%; height: auto;" />
    </td>
  </tr>
</table>`

    case "hero-banner":
      return `
<div style="position: relative; 
            padding: 32px; 
            text-align: center; 
            background-image: url(${props.imageUrl || "/placeholder.jpg"}); 
            background-size: cover; 
            background-position: center; 
            color: ${props.textColor || "#ffffff"}; 
            min-height: 200px; 
            font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"};">
  <div style="position: absolute; 
              top: 0; 
              left: 0; 
              right: 0; 
              bottom: 0; 
              background-color: ${props.overlayColor || "rgba(0,0,0,0.3)"};">
  </div>
  <div style="position: relative; z-index: 10;">
    <h1 style="font-weight: ${props.fontWeight || "normal"}; 
               line-height: ${props.lineHeight || 1}; 
               letter-spacing: ${props.letterSpacing || "2px"}; 
               font-size: ${props.fontSize || 35}px; 
               margin-bottom: 8px;">
      ${props.title || "Hero Title"}
    </h1>
    <p style="font-size: ${props.subtitleFontSize || 17}px; 
              line-height: ${props.lineHeight || 1.8}; 
              letter-spacing: ${props.letterSpacing || "2px"}; 
              text-decoration: ${props.subtitleUnderlined ? "underline" : "none"}; 
              text-underline-offset: ${props.subtitleUnderlined ? "5px" : "auto"}; 
              margin-bottom: 16px;">
      ${props.subtitle || "Hero subtitle text"}
    </p>
    <button style="background-color: ${props.buttonStyle === "filled" ? props.buttonColor || "#000000" : "transparent"}; 
                   color: ${
                     props.buttonStyle === "filled"
                       ? props.buttonTextColor || "#ffffff"
                       : props.buttonTextColor || "#ffffff"
                   }; 
                   letter-spacing: 1.5px; 
                   padding: ${props.buttonStyle === "underlined" ? "15px 24px 5px" : "15px 24px"}; 
                   font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
                   border-width: ${
                     props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0"
                   }; 
                   border-style: ${
                     props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none"
                   }; 
                   border-color: ${
                     props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "#ffffff" : "transparent"
                   }; 
                   border-radius: 4px;">
      ${props.buttonText || "Button"}
    </button>
  </div>
</div>`

    case "image-text-section":
      return `
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td width="33.33%" valign="top">
      <img src="${props.imageUrl || "/placeholder.jpg"}" 
           alt="${props.imageAlt || "Image"}" 
           style="width: 100%; height: auto;" />
    </td>
    <td width="66.67%" valign="top" style="padding: 16px; 
                                           color: ${props.textColor || "#000000"}; 
                                           text-align: ${props.textAlign || "left"}; 
                                           font-family: ${
                                             props.fontFamily || "Georgia, 'Times New Roman', Times, serif"
                                           };">
      <h3 style="font-size: 18px; 
                 font-weight: bold; 
                 margin-bottom: 8px; 
                 line-height: ${props.lineHeight || 1.8}; 
                 letter-spacing: ${props.letterSpacing || "2px"};">
        ${props.title || "Section Title"}
      </h3>
      <p style="font-size: ${props.fontSize || 17}px; 
                font-weight: ${props.fontWeight || "normal"}; 
                line-height: ${props.lineHeight || 1.8}; 
                letter-spacing: ${props.letterSpacing || "2px"};">
        ${props.text || "Section text content goes here"}
      </p>
      <button style="background-color: ${props.buttonStyle === "filled" ? props.buttonColor || "#1a82e2" : "transparent"}; 
                     color: ${
                       props.buttonStyle === "filled"
                         ? props.buttonTextColor || "#ffffff"
                         : props.buttonTextColor || "#000000"
                     }; 
                     letter-spacing: 1.5px; 
                     padding: ${props.buttonStyle === "underlined" ? "15px 24px 5px" : "8px 16px"}; 
                     font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
                     border-width: ${
                       props.buttonStyle === "outlined" ? "1px" : props.buttonStyle === "underlined" ? "0 0 1px 0" : "0"
                     }; 
                     border-style: ${
                       props.buttonStyle === "outlined" || props.buttonStyle === "underlined" ? "solid" : "none"
                     }; 
                     border-color: ${
                       props.buttonStyle === "outlined" || props.buttonStyle === "underlined"
                         ? "#000000"
                         : "transparent"
                     }; 
                     margin-top: 12px; 
                     border-radius: 4px;">
        ${props.buttonText || "Button"}
      </button>
    </td>
  </tr>
</table>`

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
                                 ? props.buttonColor || "#000000"
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

    case "single-button":
      let buttonHtml = `
<div style="padding: 16px; text-align: center;">
  <div style="display: inline-block; position: relative; text-align: center;">`

      // Main button
      buttonHtml += `
    <button style="background-color: ${props.buttonStyle === "filled" ? props.buttonColor || "#000000" : "transparent"}; 
                   color: ${
                     props.buttonStyle === "filled"
                       ? props.buttonTextColor || "#ffffff"
                       : props.buttonTextColor || "#000000"
                   }; 
                   font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
                   font-size: ${props.fontSize || 17}px; 
                   font-weight: ${props.fontWeight || "normal"}; 
                   line-height: ${props.lineHeight || 1.8}; 
                   letter-spacing: ${props.letterSpacing || "1.5px"}; 
                   padding: 12px 24px; 
                   border-width: ${props.buttonStyle === "outlined" ? "1px" : "0"}; 
                   border-style: ${props.buttonStyle === "outlined" ? "solid" : "none"}; 
                   border-color: ${props.buttonStyle === "outlined" ? "#000000" : "transparent"}; 
                   text-decoration: none; 
                   min-width: 200px; 
                   white-space: pre-wrap;">
      ${props.buttonText || "Click Here To Join"}
    </button>`

      // Add underline for underlined style
      if (props.buttonStyle === "underlined") {
        buttonHtml += `
    <div style="position: absolute; 
                bottom: 0; 
                left: 50%; 
                transform: translateX(-50%); 
                width: auto; 
                border-bottom: 1px solid; 
                border-color: ${props.buttonColor || "#000000"}; 
                margin-top: 5px; 
                padding: 0;">
      <span style="visibility: hidden; 
                   font-family: ${props.fontFamily || "Georgia, 'Times New Roman', Times, serif"}; 
                   font-size: ${props.fontSize || 17}px; 
                   font-weight: ${props.fontWeight || "normal"}; 
                   letter-spacing: ${props.letterSpacing || "1.5px"}; 
                   white-space: pre-wrap; 
                   display: inline-block; 
                   padding: 0;">
        ${props.buttonText || "Click Here To Join"}
      </span>
    </div>`
      }

      buttonHtml += `
  </div>
</div>`
      return buttonHtml

    case "footer":
      return `
<!-- Footer -->
<div class="w-full">
  <!-- Main footer table -->
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto;">
    <tbody>
      <!-- Top black navigation bar -->
      <tr>
        <td bgcolor="#000000">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td align="center" style="padding: 15px; background: #000000;">
                  <table cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td align="left" style="line-height: 1.2; vertical-align: top;">
                          <a href="#" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: normal;" rel="noreferrer">
                            <span style="font-family: Georgia, Times, serif; font-size: 14px; color: #ffffff; line-height: 1.2;">
                              New In
                            </span>
                          </a>
                        </td>
                        <td width="80"></td>
                        <td align="left" style="line-height: 1.2; vertical-align: top;">
                          <a href="#" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: normal;" rel="noreferrer">
                            <span style="font-family: Georgia, Times, serif; font-size: 14px; color: #ffffff; line-height: 1.2;">
                              Dresses
                            </span>
                          </a>
                        </td>
                        <td width="80"></td>
                        <td align="left" style="line-height: 1.2; vertical-align: top;">
                          <a href="#" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: normal;" rel="noreferrer">
                            <span style="font-family: Georgia, Times, serif; font-size: 14px; color: #ffffff; line-height: 1.2;">
                              Shoes
                            </span>
                          </a>
                        </td>
                        <td width="80"></td>
                        <td align="left" style="line-height: 1.2; vertical-align: top;">
                          <a href="#" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: normal;" rel="noreferrer">
                            <span style="font-family: Georgia, Times, serif; font-size: 14px; color: #ffffff; line-height: 1.2;">
                              Bags
                            </span>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <!-- Spacer -->
      <tr>
        <td height="30"></td>
      </tr>

      <!-- Service section -->
      <tr>
        <td bgcolor="#ffffff">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                      <tr>
                        <!-- First column -->
                        <th align="left" style="padding: 0; margin: 0; border: 0; font-weight: normal; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="left" style="vertical-align: top;">
                                  <table cellpadding="0" cellspacing="0" width="155">
                                    <tbody>
                                      <tr>
                                        <td height="45" align="center" style="vertical-align: middle;">
                                          <a href="#" target="_blank" style="text-decoration: none; font-weight: normal; color: #000000;" rel="noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="15"></td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="line-height: 1.2;">
                                          <a href="#" target="_blank" style="color: #000000; text-decoration: none; font-weight: normal;" rel="noreferrer">
                                            <span style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; color: #000000; font-weight: normal; line-height: 1.2;">
                                              Delivery Information
                                            </span>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="35"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td width="10"></td>
                                <td align="left" style="vertical-align: top;">
                                  <table cellpadding="0" cellspacing="0" width="155">
                                    <tbody>
                                      <tr>
                                        <td height="45" align="center" style="vertical-align: middle;">
                                          <a href="#" target="_blank" style="text-decoration: none; font-weight: normal; color: #000000;" rel="noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="15"></td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="line-height: 1.2;">
                                          <a href="#" target="_blank" style="color: #000000; text-decoration: none; font-weight: normal;" rel="noreferrer">
                                            <span style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; color: #000000; font-weight: normal; line-height: 1.2;">
                                              Pay With Klarna
                                            </span>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="35"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </th>
                        <th width="10" style="padding: 0; margin: 0; border: 0; font-weight: normal; vertical-align: top;"></th>
                        <!-- Second column -->
                        <th align="left" style="padding: 0; margin: 0; border: 0; font-weight: normal; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="left" style="vertical-align: top;">
                                  <table cellpadding="0" cellspacing="0" width="155">
                                    <tbody>
                                      <tr>
                                        <td height="45" align="center" style="vertical-align: middle;">
                                          <a href="#" target="_blank" style="text-decoration: none; font-weight: normal; color: #000000;" rel="noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="15"></td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="line-height: 1.2;">
                                          <a href="#" target="_blank" style="color: #000000; text-decoration: none; font-weight: normal;" rel="noreferrer">
                                            <span style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; color: #000000; font-weight: normal; line-height: 1.2;">
                                              Call &amp; Shop
                                            </span>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="35"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td width="10"></td>
                                <td align="left" style="vertical-align: top;">
                                  <table cellpadding="0" cellspacing="0" width="155">
                                    <tbody>
                                      <tr>
                                        <td height="45" align="center" style="vertical-align: middle;">
                                          <a href="#" target="_blank" style="text-decoration: none; font-weight: normal; color: #000000;" rel="noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"></path><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"></path></svg>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="15"></td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="line-height: 1.2;">
                                          <a href="#" target="_blank" style="color: #000000; text-decoration: none; font-weight: normal;" rel="noreferrer">
                                            <span style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; color: #000000; font-weight: normal; line-height: 1.2;">
                                              Returns &amp; Refunds
                                            </span>
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="35"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      
      <!-- Social Media Section -->
      <tr>
        <td bgcolor="#ffffff">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td height="30"></td>
              </tr>
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td width="40" align="center">
                          <a href="#" target="_blank" style="text-decoration: none; color: #000000;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </a>
                        </td>
                        <td width="20"></td>
                        <td width="40" align="center">
                          <a href="#" target="_blank" style="text-decoration: none; color: #000000;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                        </td>
                        <td width="20"></td>
                        <td width="40" align="center">
                          <a href="#" target="_blank" style="text-decoration: none; color: #000000;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 11.39v-.77c.44-.17.74-.56.81-1.03c.17-1.12.68-1.59 1.27-1.59c.58 0 1.09.47 1.27 1.59c.07.47.37.86.81 1.03v.77c0 .55-.45 1-1 1h-2.16c-.55 0-1-.45-1-1Z"></path><path d="M12 17c1.5 0 2.5-2 3-3.5"></path><path d="M9 13.5c.5 1.5 1.5 3.5 3 3.5"></path></svg>
                          </a>
                        </td>
                        <td width="20"></td>
                        <td width="40" align="center">
                          <a href="#" target="_blank" style="text-decoration: none; color: #000000;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td height="30"></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <!-- Legal Footer -->
      <tr>
        <td bgcolor="#f8f9fa" style="padding: 30px 20px; text-align: center; color: #666666; font-family: Arial, sans-serif; font-size: 12px;">
          <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} ${props.companyName || "Your Company"}. All rights reserved.</p>
          <p style="margin: 0 0 10px 0;">
            <a href="${props.privacyUrl || "#"}" style="color: #1a82e2; text-decoration: underline;">Privacy Policy</a> |
            <a href="${props.unsubscribeUrl || "#"}" style="color: #1a82e2; text-decoration: underline;">Unsubscribe</a>
          </p>
          <p style="margin: 0;">If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #1a82e2; text-decoration: underline;">support@example.com</a></p>
        </td>
      </tr>
    </tbody>
  </table>
</div>`

    default:
      return `<div>Unknown component type: ${component.type}</div>`
  }
}

// Generate the full HTML email
export const generateEmailHtml = (
  components: EmailComponent[],
  headerComponent: EmailComponent | null,
  footerComponent: EmailComponent | null,
): string => {
  // Start with the HTML boilerplate
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Georgia, 'Times New Roman', Times, serif;
      line-height: 1.6;
      color: #000000;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      display: block;
      max-width: 100%;
    }
    .email-container {
      max-width: 650px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    @media only screen and (max-width: 650px) {
      .email-container {
        width: 100% !important;
      }
      .responsive-table {
        width: 100% !important;
      }
      .responsive-column {
        width: 100% !important;
        display: block !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="email-container" width="650" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
          <tr>
            <td style="padding: 0;">`

  // Add header component if it exists
  if (headerComponent) {
    html += generateComponentHtml(headerComponent)
  }

  // Add all regular components
  components.forEach((component) => {
    html += generateComponentHtml(component)
  })

  // Add footer component if it exists
  if (footerComponent) {
    html += generateComponentHtml(footerComponent)
  }

  // Close the HTML
  html += `
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return html
}
