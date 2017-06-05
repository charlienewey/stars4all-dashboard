# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.define :notebook
  config.vm.hostname = "notebook"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "8192"
    vb.customize ["modifyvm", :id, "--uartmode1", "disconnected"]
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "site.yml"
    ansible.groups = {
      "db" => [:notebook],
      "jupyterhub" => [:notebook]
    }
  end

  config.vm.network "forwarded_port", guest: 8888, host: 8888

  config.vm.synced_folder "./", "/vagrant",
    id: "vagrant-root",
    owner: "charlie",
    group: "ubuntu",
    mount_options: ["dmode=775,fmode=664"]
end
