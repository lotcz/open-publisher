package eu.zavadil.openpublisher.service;

import eu.zavadil.java.oauth.client.admin.OAuthAdminClient;
import eu.zavadil.java.oauth.common.token.PermissionLevel;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openpublisher.data.SyncState;
import eu.zavadil.openpublisher.data.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class OAuthSyncService {

	@Value("${oauth.self-name}")
	String oauthAudience;

	@Autowired
	OAuthAdminClient oAuthClient;

	@Autowired
	UsersService usersService;

	public void syncUser(User user) {
		try {
			eu.zavadil.java.oauth.client.admin.payload.User oauthUser = StringUtils.isBlank(user.getOauthSubject())
				? new eu.zavadil.java.oauth.client.admin.payload.User()
				: this.oAuthClient.loadUserBySubject(user.getOauthSubject());

			// sync user
			oauthUser.setActive(user.isActive());
			oauthUser.setName(user.getEmail());
			oauthUser.setEmail(user.getEmail());
			oauthUser = this.oAuthClient.saveUser(oauthUser);

			// sync permissions
			this.oAuthClient.resetUserPermissions(oauthUser.getId());
			this.oAuthClient.grantUserPermission(
				oauthUser.getId(),
				this.oauthAudience,
				user.getUserRole().getPermission(),
				PermissionLevel.admin
			);

			// save user
			user.setOauthSubject(oauthUser.getSubject());
			user.setSyncState(SyncState.Synced);
		} catch (Exception e) {
			user.setSyncState(SyncState.Failed);
			log.error("Failed syncing user {}", user.getEmail(), e);
		} finally {
			this.usersService.save(user);
		}
	}

	public void syncUser(int userId) {
		this.syncUser(this.usersService.loadById(userId));
	}

}
