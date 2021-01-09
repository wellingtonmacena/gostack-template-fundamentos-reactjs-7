import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string | any;
  size: string;
}



const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();


  async function handleUpload(): Promise<void> {
    if(!uploadedFiles.length)return 
    const data = new FormData();
    const file = uploadedFiles[0]

    
    data.append('file', file.file, file.name)

    try {
      let response = await api.post("/transactions/import", data)
      history.goBack();
    } catch (err) {
       console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    let objectFiles = files.map((file: File) => ({
      file,
      name: file.name,
      size: filesize(file.size)
    }))

    console.log(objectFiles);
    setUploadedFiles(objectFiles)

  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
