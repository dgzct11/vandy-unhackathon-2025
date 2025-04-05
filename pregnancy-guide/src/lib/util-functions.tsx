export const formatMessage = (message: string) => {
  // Convert **text** to <strong> tags for bold text
  // Using a more compatible regex approach without the 's' flag
  let boldFormatted = message;
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(message)) !== null) {
    const fullMatch = match[0];
    const textToBold = match[1];
    boldFormatted = boldFormatted.replace(fullMatch, `<strong>${textToBold}</strong>`);
  }
  
  // Split into lines and process each line
  const lines = boldFormatted.split('\n');
  let inList = false;
  let listIndentLevel = 0;
  let processedHtml = '';
  let previousWasHeading = false;
  
  lines.forEach((line, index) => {
    // Trim the line for processing but keep original indentation for list detection
    const trimmedLine = line.trim();
    const indentMatch = line.match(/^\s*/);
    const indentLevel = indentMatch ? Math.floor(indentMatch[0].length / 2) : 0;
    const indentClass = indentLevel > 0 ? `ml-${indentLevel * 4}` : '';
    
    // Skip completely empty lines
    if (!trimmedLine) {
      processedHtml += '<br/>';
      return;
    }
    
    // Process headings (h1, h2, h3)
    if (trimmedLine.startsWith('### ')) {
      // Close any open lists before adding a heading
      if (inList) {
        for (let i = 0; i <= listIndentLevel; i++) {
          processedHtml += '</ul>';
        }
        inList = false;
        listIndentLevel = 0;
      }
      
      // Add spacing before heading if not at the beginning
      if (index > 0 && !previousWasHeading) {
        processedHtml += '<div class="mt-4"></div>';
      }
      
      processedHtml += `<h3 class="${indentClass} text-lg font-semibold mt-3 mb-2">${trimmedLine.substring(4)}</h3>`;
      previousWasHeading = true;
      return;
    }
    
    if (trimmedLine.startsWith('## ')) {
      // Close any open lists before adding a heading
      if (inList) {
        for (let i = 0; i <= listIndentLevel; i++) {
          processedHtml += '</ul>';
        }
        inList = false;
        listIndentLevel = 0;
      }
      
      // Add spacing before heading if not at the beginning
      if (index > 0 && !previousWasHeading) {
        processedHtml += '<div class="mt-5"></div>';
      }
      
      processedHtml += `<h2 class="${indentClass} text-xl font-semibold mt-4 mb-3">${trimmedLine.substring(3)}</h2>`;
      previousWasHeading = true;
      return;
    }
    
    if (trimmedLine.startsWith('# ')) {
      // Close any open lists before adding a heading
      if (inList) {
        for (let i = 0; i <= listIndentLevel; i++) {
          processedHtml += '</ul>';
        }
        inList = false;
        listIndentLevel = 0;
      }
      
      // Add spacing before heading if not at the beginning
      if (index > 0 && !previousWasHeading) {
        processedHtml += '<div class="mt-6"></div>';
      }
      
      processedHtml += `<h1 class="${indentClass} text-2xl font-bold mt-5 mb-4">${trimmedLine.substring(2)}</h1>`;
      previousWasHeading = true;
      return;
    }
    
    // Reset heading flag for non-heading content
    previousWasHeading = false;
    
    // Process list items (improved to handle indentation)
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      const bulletType = trimmedLine.startsWith('- ') ? '- ' : '• ';
      
      if (!inList) {
        // Start a new list
        processedHtml += '<ul class="list-disc pl-5 space-y-1">';
        inList = true;
        listIndentLevel = indentLevel;
      } else if (indentLevel > listIndentLevel) {
        // Nested list item - create nested ul
        processedHtml += '<ul class="list-disc pl-4 mt-1">';
        listIndentLevel = indentLevel;
      } else if (indentLevel < listIndentLevel) {
        // Going back up in indentation - close nested lists
        const levelDiff = listIndentLevel - indentLevel;
        for (let i = 0; i < levelDiff; i++) {
          processedHtml += '</ul>';
        }
        listIndentLevel = indentLevel;
      }
      
      // Add the list item content (after the bullet)
      processedHtml += `<li>${trimmedLine.substring(bulletType.length)}</li>`;
      return;
    }
    
    // If we're in a list but not on a list item anymore, close all open lists
    if (inList && !(trimmedLine.startsWith('- ') || trimmedLine.startsWith('• '))) {
      // Close all nested lists
      for (let i = 0; i <= listIndentLevel; i++) {
        processedHtml += '</ul>';
      }
      inList = false;
      listIndentLevel = 0;
    }
    
    // Process regular text with proper indentation
    processedHtml += `<span class="${indentClass}">${trimmedLine}</span><br/>`;
  });
  
  // Close any open list at the end
  if (inList) {
    for (let i = 0; i <= listIndentLevel; i++) {
      processedHtml += '</ul>';
    }
  }
  
  // Return a single div with the processed HTML to avoid nesting issues
  return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: processedHtml }} />;
};
  