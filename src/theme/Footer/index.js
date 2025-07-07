import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';

function Footer() {
	const { footer } = useThemeConfig();

	if (!footer) {
		return null;
	}

	return (
		<footer className="footer footer--dark">
			<div className="container container-fluid">
				<div className="footer__bottom text--center">
					{footer.copyright && (
						<div className="footer__copyright">{footer.copyright}</div>
					)}
				</div>
			</div>
		</footer>
	);
}

export default React.memo(Footer);