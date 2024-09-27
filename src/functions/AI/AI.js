import React, { useState } from 'react';
import { Box, Typography, Button, Input, Grid, Paper } from '@mui/material';

function AI() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // FileReaderを使用して画像のプレビューURLを作成
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setAnalysisResult(data.analyzeResult);
      } else {
        setAnalysisResult('画像分析に失敗しました。');
      }
    } catch (error) {
      setAnalysisResult('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '0 25rem' }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>
        AI<ruby>画像分析<rt>がぞうぶんせき</rt></ruby>
      </Typography>

      <Typography variant="body1" gutterBottom>
        <ruby>画像<rt>がぞう</rt></ruby>をアップロードして、AIによる<ruby>分析結果<rt>ぶんせきけっか</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>してください。
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <Input
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: 'image/*' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
          >
            {loading ? '分析中...' : '分析開始'}
          </Button>
        </Grid>
      </Grid>

      {previewUrl && (
        <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            <ruby>選択<rt>せんたく</rt></ruby>された<ruby>画像<rt>がぞう</rt></ruby>
          </Typography>
          <img
            src={previewUrl}
            alt="Selected preview"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
      )}

      {analysisResult && (
        <Paper sx={{ marginTop: '2rem', padding: '1rem' }}>
          <Typography variant="h6"><ruby>分析結果<rt>ぶんせきけっか</rt></ruby></Typography>
          <Typography variant="body2">{analysisResult}</Typography>
        </Paper>
      )}
    </Box>
  );
}

export default AI;