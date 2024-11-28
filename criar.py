import os
import subprocess
import sys
import shutil

def run_command(command, cwd=None):
    """Executa um comando de shell e verifica se foi executado com sucesso."""
    result = subprocess.run(command, shell=True, cwd=cwd)
    if result.returncode != 0:
        print(f"\nErro ao executar o comando: {command}")
        sys.exit(1)

def remove_directory(path):
    """Remove um diretório e seus conteúdos de forma segura."""
    try:
        shutil.rmtree(path)
        print(f"\nDiretório '{path}' removido com sucesso.")
    except Exception as e:
        print(f"\nErro ao remover o diretório '{path}': {e}")
        print("Por favor, certifique-se de que nenhum arquivo está em uso e que você tem permissões adequadas.")
        sys.exit(1)

def create_nextjs_frontend():
    print("\nIniciando a criação do frontend com Next.js...")

    project_dir = os.getcwd()
    frontend_dir = os.path.join(project_dir, 'frontend-next')

    # Verifica se o diretório 'frontend-next' já existe
    if os.path.exists(frontend_dir):
        print("\nO diretório 'frontend-next' já existe. Removendo-o para recriar o projeto.")
        remove_directory(frontend_dir)

    # Cria um novo aplicativo Next.js com versão estável
    run_command("npx create-next-app@13.4.12 frontend-next --use-npm")

    # Navega para o diretório do frontend
    os.chdir(frontend_dir)

    # Instala as dependências adicionais com versões compatíveis
    run_command("npm install react@18.2.0 react-dom@18.2.0")
    run_command("npm install styled-components@6.1.9 axios@1.4.0")

    # Instala o babel-plugin-styled-components como dependência de desenvolvimento
    run_command("npm install --save-dev babel-plugin-styled-components@2.1.3")

    # Cria o arquivo .babelrc
    babelrc_content = '''{
  "presets": ["next/babel"],
  "plugins": [["styled-components", { "ssr": true }]]
}
'''
    with open('.babelrc', 'w', encoding='utf-8') as f:
        f.write(babelrc_content)

    # Cria o arquivo pages/_document.js
    document_js_content = '''import Document from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
'''
    with open('pages/_document.js', 'w', encoding='utf-8') as f:
        f.write(document_js_content)

    # Cria o tema em styles/theme.js
    os.makedirs('styles', exist_ok=True)
    theme_js_content = '''export const theme = {
  colors: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#1DB954',
    secondary: '#191414',
  },
  fonts: ['sans-serif', 'Roboto'],
};
'''
    with open('styles/theme.js', 'w', encoding='utf-8') as f:
        f.write(theme_js_content)

    # Cria os estilos globais em styles/globalStyles.js
    global_styles_content = '''import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle\`
  body {
    margin: 0;
    padding: 0;
    background-color: \${({ theme }) => theme.colors.background};
    color: \${({ theme }) => theme.colors.text};
    font-family: \${({ theme }) => theme.fonts.join(',')};
  }
\`;

export default GlobalStyle;
'''
    with open('styles/globalStyles.js', 'w', encoding='utf-8') as f:
        f.write(global_styles_content)

    # Atualiza o pages/_app.js
    app_js_content = '''import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import GlobalStyle from '../styles/globalStyles';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
'''
    with open('pages/_app.js', 'w', encoding='utf-8') as f:
        f.write(app_js_content)

    # Cria as páginas
    pages = ['index.js', 'login.js', 'register.js', 'tasks.js', 'vaults.js', 'progress.js']
    for page in pages:
        component_name = page.replace('.js', '').capitalize()
        page_content = f'''import { {component_name} } from '../components/{component_name}';

export default function {component_name}Page() {{
  return <{component_name} />;
}}
'''
        with open(f'pages/{page}', 'w', encoding='utf-8') as f:
            f.write(page_content)

    # Cria os componentes
    os.makedirs('components', exist_ok=True)
    component_template = '''import styled from 'styled-components';

const Container = styled.div\`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
\`;

const Title = styled.h1\`
  font-size: 3em;
  color: \${({{ theme }}) => theme.colors.primary};
\`;

export function {component_name}() {{
  return (
    <Container>
      <Title>{component_name}</Title>
      <p>Bem-vindo à página {component_name_lower}!</p>
    </Container>
  );
}}
'''
    components = ['Home', 'Login', 'Register', 'Tasks', 'Vaults', 'Progress']
    for component_name in components:
        component_name_lower = component_name.lower()
        component_code = component_template.format(
            component_name=component_name,
            component_name_lower=component_name_lower
        )
        with open(f'components/{component_name}.js', 'w', encoding='utf-8') as f:
            f.write(component_code)

    print("\nFrontend Next.js criado com sucesso.")

def main():
    create_nextjs_frontend()
    print("\nConfiguração do frontend concluída!")

if __name__ == '__main__':
    main()
