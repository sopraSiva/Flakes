// Theme Configuration
// Change the activeTheme value to switch between themes
// Available themes: 'ThemeA', 'ThemeB'

export const themeConfig = {
  activeTheme: 'ThemeB', // Change this to 'ThemeA' or 'ThemeB'
  themes: {
    ThemeA: {
      name: 'Tesco Blue Theme',
      cssFile: '/src/styles/ThemeA.css'
    },
    ThemeB: {
      name: 'Purple Theme', 
      cssFile: '/src/styles/ThemeB.css'
    }
  }
};