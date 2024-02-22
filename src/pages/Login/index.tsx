import { Box, Grid } from '@mui/material';

import { FormLogin } from './components/FormLogin';

export const Login = () => {
	return (
		<Box
			sx={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Grid
				container
				spacing={{ xs: 2, sm: 2, md: 2 }}
				columns={{ xs: 12, sm: 12, md: 12 }}
				sx={{
					width: '100%',
					height: '100%',
				}}
			>
				<Grid item xs={7} sm={7} md={8}>
					<Box
						component="img"
						src="https://cdn.discordapp.com/attachments/1205276384352538797/1205294973919170600/Conectando_confianca_reparando_eficiencia.png?ex=65d7d96b&is=65c5646b&hm=f19bc6216321e140ceb905438423fb42d1a4ed0c6be950f65395a8fc7ea2ccfb&"
						sx={{
							width: '100%',
							height: '100%',
						}}
					/>
				</Grid>

				<FormLogin />
			</Grid>
		</Box>
	);
};
