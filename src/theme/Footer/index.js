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
					<div className="footer__beian">
						<a
							href="https://beian.miit.gov.cn/"
							target="_blank"
							rel="noopener noreferrer"
							style={{ color: '#666', textDecoration: 'none' }}
						>
							苏ICP备2024152646号-4
						</a>
						<span style={{ color: '#666', marginLeft: '8px' }}>
							苏州酷豆物联科技有限公司
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default React.memo(Footer);